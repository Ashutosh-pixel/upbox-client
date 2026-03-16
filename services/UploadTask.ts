import { createChunks } from "@/lib/utils";
import axios from "axios";

export default class UploadTask extends EventTarget {

    /* -------------------- Upload Configuration -------------------- */

    private baseUrl: string;
    private file: File;
    private fileName: string;
    private userID: string;
    private parentID: string | null;

    /* -------------------- File Info -------------------- */

    private fileSize: number;
    private chunkSize: number = 5 * 1024 * 1024;
    private totalParts: number;
    private chunks: Blob[] = [];

    /* -------------------- Upload State -------------------- */

    private index: number;
    private uploadedBytes: number = 0;
    private uploadParts: { PartNumber: number; ETag: string }[] = [];

    /* -------------------- Metadata from server -------------------- */

    private fileID: string | undefined;
    private metadata: any = null;

    /* -------------------- Control & Safety -------------------- */

    private controller = new AbortController();
    private cancelling = false;
    private isPaused = false;

    /* -------------------- UI reference -------------------- */

    private tempFileID: string;

    /* -------------------- Constructor -------------------- */

    constructor(
        index: number,
        baseUrl: string,
        file: File,
        fileName: string,
        userID: string,
        parentID: string | null,
        tempFileID: string
    ) {
        super();

        this.baseUrl = baseUrl;
        this.file = file;
        this.fileName = fileName.trim();
        this.userID = userID;
        this.parentID = parentID;
        this.fileSize = file.size;
        this.index = index;
        this.tempFileID = tempFileID;

        const { totalParts, chunks } = createChunks(file, this.chunkSize);

        this.totalParts = totalParts;
        this.chunks = chunks;
    }

    /* ============================================================
       MAIN UPLOAD ENTRY
       ============================================================ */

    public async startUpload() {

        try {

            // Step 1: create upload session in backend
            await this.initializeUploadSession();

            this.emitEvent("initiate", "hashing");

            if (!this.fileID) return;

            const CONCURRENCY = 3;
            const workers: Promise<void>[] = [];

            // Step 2: start worker pool
            for (let i = 0; i < CONCURRENCY; i++) {
                workers.push(this.chunkWorker());
            }

            await Promise.all(workers);

            // Step 3: complete upload
            if (this.uploadParts.length === this.totalParts) {
                await this.completeMultipartUpload();
            }

        } catch (error) {
            console.log("Upload failed", error);
        }
    }

    /* ============================================================
       INITIALIZE UPLOAD SESSION
       ============================================================ */

    private async initializeUploadSession() {

        try {

            const res = await axios.post(
                `${this.baseUrl}/user/uploadfile`,
                {
                    fileName: this.fileName,
                    userID: this.userID,
                    fileSize: this.fileSize,
                    totalParts: this.totalParts,
                    chunkSize: this.chunkSize,
                    fileType: this.file.type,
                    parentID: this.parentID
                },
                { signal: this.controller.signal }
            );

            this.fileID = res.data.fileID;

            this.metadata = {
                uploadId: res.data.uploadId,
                storagePath: res.data.storagePath
            };

        } catch (error) {
            console.log("Failed to create upload session", error);
            throw error;
        }
    }

    /* ============================================================
       WORKER (PARALLEL CHUNK PROCESSOR)
       ============================================================ */

    private async chunkWorker() {

        while (this.index < this.totalParts) {

            if (this.isPaused) return;

            const partIndex = this.index;
            this.index++;

            await this.uploadSingleChunk(partIndex);
        }
    }

    /* ============================================================
       UPLOAD SINGLE CHUNK (WITH RETRY)
       ============================================================ */

    private async uploadSingleChunk(partIndex: number) {

        const MAX_RETRY = 3;

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {

            try {

                // Step 1: get presigned URL
                const url = await this.getPresignedUrl(partIndex);

                // Step 2: upload chunk to S3
                const eTag = await this.uploadChunkToS3(url, partIndex);

                const partInfo = {
                    PartNumber: partIndex + 1,
                    ETag: eTag
                };

                // Step 3: save chunk metadata to DB
                await this.saveChunkWithRetry(partInfo);

                // Update state
                this.uploadParts[partIndex] = partInfo;
                this.uploadedBytes += this.chunks[partIndex].size;

                this.emitEvent("progress", "uploading");

                return;

            } catch (error) {

                if (attempt === MAX_RETRY) {

                    if (!this.controller.signal.aborted && !this.cancelling) {
                        this.cancelling = true;
                        await this.abortUpload();
                    }

                    throw error;
                }

                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    /* ============================================================
       GET PRESIGNED URL
       ============================================================ */

    private async getPresignedUrl(partIndex: number): Promise<string> {

        const res = await fetch(
            `${this.baseUrl}/user/file/upload/url?fileName=${this.fileName}&uploadId=${this.metadata.uploadId}&storagePath=${this.metadata.storagePath}&partNumber=${partIndex + 1}`,
            { signal: this.controller.signal }
        );

        if (!res.ok) throw new Error("Presigned URL fetch failed");

        const data = await res.json();

        return data.url;
    }

    /* ============================================================
       UPLOAD CHUNK TO S3
       ============================================================ */

    private async uploadChunkToS3(url: string, partIndex: number): Promise<string> {

        const uploadRes = await axios.put(
            url,
            this.chunks[partIndex],
            { signal: this.controller.signal }
        );

        return uploadRes.headers["etag"] || uploadRes.headers["Etag"];
    }

    /* ============================================================
       SAVE CHUNK METADATA
       ============================================================ */

    private async saveChunkMetadata(partInfo: { PartNumber: number; ETag: string }) {

        await axios.post(
            `${this.baseUrl}/user/file/uploadsession/uploadparts`,
            {
                uploadPartInfo: partInfo,
                userID: this.userID,
                fileName: this.fileName,
                uploadId: this.metadata.uploadId,
                fileID: this.fileID,
                fileSize: this.fileSize,
                chunkSize: this.chunkSize,
                totalParts: this.totalParts
            },
            { signal: this.controller.signal }
        );
    }

    /* ============================================================
       SAVE CHUNK WITH RETRY
       ============================================================ */

    private async saveChunkWithRetry(partInfo: { PartNumber: number; ETag: string }) {

        const MAX_RETRY = 5;

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {

            try {
                await this.saveChunkMetadata(partInfo);
                return;

            } catch (error) {

                if (attempt === MAX_RETRY) {

                    if (!this.cancelling) {
                        this.cancelling = true;
                        await this.abortUpload();
                    }

                    throw error;
                }

                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    /* ============================================================
       COMPLETE MULTIPART UPLOAD
       ============================================================ */

    private async completeMultipartUpload() {

        const res = await axios.post(
            `${this.baseUrl}/user/file/upload/complete`,
            {
                uploadId: this.metadata.uploadId,
                parts: this.uploadParts.sort((a, b) => a.PartNumber - b.PartNumber),
                storagePath: this.metadata.storagePath,
                fileID: this.fileID
            },
            { signal: this.controller.signal }
        );

        this.emitEvent("completed", "completed");

        alert(res.data.message || res.data.error);
    }

    /* ============================================================
       CANCEL UPLOAD
       ============================================================ */

    private async abortUpload() {

        try {

            await axios.put(
                `${this.baseUrl}/user/file/${this.fileID}`,
                {
                    storagePath: this.metadata.storagePath,
                    uploadId: this.metadata.uploadId
                }
            );

            this.controller.abort();

            this.emitEvent("aborted", "aborted");

        } catch (error) {
            console.log("Cancel upload failed", error);
        }
    }

    /* ============================================================
       EVENT EMITTER
       ============================================================ */

    private emitEvent(event: string, status: string) {

        this.dispatchEvent(
            new CustomEvent(event, {
                detail: {
                    fileID: this.fileID,
                    fileName: this.fileName,
                    uploadedBytes: this.uploadedBytes,
                    totalSize: this.fileSize,
                    status: status,
                    tempFileID: this.tempFileID
                }
            })
        );
    }

    /* ============================================================
       PAUSE UPLOAD
       ============================================================ */

    public pauseUpload() {
        if (this.isPaused) return;

        this.isPaused = true;

        this.controller.abort();

        this.emitEvent("paused", "paused");
    }
}