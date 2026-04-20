import { createChunks } from "@/lib/utils";
import axios from "axios";
import { uploadManager } from "./UploadManager";
import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";
import { rename, setRenamedArray } from "@/lib/redux/slice/renameArraySlice";
import { v4 as uuidv4 } from 'uuid';

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
    public status: string = "waiting";

    /* -------------------- Metadata from server -------------------- */

    public fileID: string | undefined;
    private metadata: any = null;

    /* -------------------- Control & Safety -------------------- */

    private controller = new AbortController();
    private cancelling = false;
    private isPaused = false;

    /* -------------------- UI reference -------------------- */

    private tempFileID: string;

    /* -------------------- DB SYNC STATE -------------------- */

    private pendingDBWrites: ({ PartNumber: number; ETag: string } | undefined)[] = [];

    /* -------------------- Constructor -------------------- */

    private dispatch: Dispatch<UnknownAction>;

    constructor(
        index: number,
        baseUrl: string,
        file: File,
        fileName: string,
        userID: string,
        parentID: string | null,
        tempFileID: string,
        dispatch: Dispatch<UnknownAction>
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
        this.dispatch = dispatch;
    }

    /* ============================================================
       MAIN UPLOAD ENTRY
       ============================================================ */

    public async startUpload(task: any) {

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

        } catch (error: any) {
            console.log("Upload failed", error);
            if (error.response?.status === 409) {
                if (error.response?.data?.errorCode === "DUPLICATE_FILE") {
                    console.log('duplicate');
                    uploadManager.globalDuplicateMap.set(this.tempFileID, task);

                    const tempID = uuidv4();
                    const duplicateFiles: rename[] = [{
                        _id: tempID,
                        tempID: this.tempFileID,
                        filename: this.fileName,
                        parentID: this.parentID,
                        type: this.file.type
                    }]
                    this.dispatch(setRenamedArray(duplicateFiles));
                }
            }
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

            console.log("RES", res);

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

                // Update state
                this.uploadParts[partIndex] = partInfo;

                // Step 3: save chunk metadata to DB
                await this.saveChunkWithRetry(partInfo, partIndex);

                this.uploadedBytes += this.chunks[partIndex].size;

                this.emitEvent("progress", "uploading");

                return;

            } catch (error) {

                if (attempt === MAX_RETRY) {

                    if (!this.controller.signal.aborted && !this.cancelling && !this.isPaused) {
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

        console.log("this.metadata", this.metadata);

        /* const res = await fetch(
            `${this.baseUrl}/user/file/upload/url?fileName=${this.fileName}&uploadId=${this.metadata.uploadId}&storagePath=${this.metadata.storagePath}&partNumber=${partIndex + 1}`,
            { signal: this.controller.signal }
        ); */

        const params = new URLSearchParams({
            fileName: this.fileName,
            uploadId: this.metadata.uploadId,
            storagePath: this.metadata.storagePath,
            partNumber: String(partIndex + 1),
        });


        const res = await fetch(
            `${this.baseUrl}/user/file/upload/url?${params.toString()}`,
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

    private async saveChunkWithRetry(partInfo: { PartNumber: number; ETag: string }, partIndex: number) {

        const MAX_RETRY = 5;

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {

            try {
                await this.saveChunkMetadata(partInfo);
                return;

            } catch (error) {

                console.log("saveChunkWithRetry");

                if (attempt === MAX_RETRY) {

                    if (!this.cancelling && !this.isPaused) {
                        this.cancelling = true;
                        await this.abortUpload();
                    }

                    throw error;
                }

                this.pendingDBWrites[partIndex] = partInfo;

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

    public async abortUpload() {

        if (this.cancelling) {
            return;
        }

        this.cancelling = true;

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

        this.status = status;

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

    /* ============================================================
    RESUME UPLOAD
   ============================================================ */

    public async resumeUpload() {

        if (!this.isPaused || this.cancelling) return;

        this.isPaused = false;
        this.controller = new AbortController();

        this.emitEvent("resumed", "uploading");

        try {

            await this.flushPendingDBWritesWithRetry();

            const queue = this.buildMissingPartsQueue();

            await this.runWorkersWithRetry(queue);

            await this.tryCompleteUpload();

        } catch (error) {
            console.log("Resume failed", error);
        }
    }

    private async flushPendingDBWritesWithRetry() {

        const MAX_RETRY = 3;

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {

            let allSuccess = true;

            for (let i = 0; i < this.pendingDBWrites.length; i++) {

                const partInfo = this.pendingDBWrites[i];
                if (!partInfo) continue;

                try {
                    await this.saveChunkMetadata(partInfo);
                    this.pendingDBWrites[i] = undefined;
                } catch (error) {
                    allSuccess = false;

                    if (!this.cancelling && !this.isPaused) {
                        this.cancelling = true;
                        await this.abortUpload();
                    }
                }
            }

            if (allSuccess) return;

            await new Promise(r => setTimeout(r, 1000));
        }

        console.log("Some DB writes still pending, will retry later");
    }

    private buildMissingPartsQueue(): number[] {

        const queue: number[] = [];

        for (let i = 0; i < this.totalParts; i++) {
            if (!this.uploadParts[i]) {
                queue.push(i);
            }
        }

        return queue;
    }

    private async runWorkersWithRetry(queue: number[]) {

        const MAX_RETRY = 2;

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {

            try {

                const CONCURRENCY = 3;
                const workers: Promise<void>[] = [];

                for (let i = 0; i < CONCURRENCY; i++) {
                    workers.push(this.queueWorker(queue));
                }

                await Promise.all(workers);
                return;

            } catch (error) {

                if (attempt === MAX_RETRY) {
                    if (!this.cancelling && !this.isPaused) {
                        this.cancelling = true;
                        await this.abortUpload();
                    }
                    throw error;
                }

                console.log("Retrying worker batch...");
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    private async queueWorker(queue: number[]) {

        while (queue.length > 0 && !this.isPaused) {

            const partIndex = queue.shift();
            if (partIndex === undefined) return;

            try {
                await this.uploadSingleChunk(partIndex);

            } catch (error) {

                console.log("Chunk failed, re-queueing", partIndex);

                queue.push(partIndex);
            }
        }
    }

    private async tryCompleteUpload() {

        const uploadedCount = this.uploadParts.filter(Boolean).length;

        if (uploadedCount === this.totalParts) {
            await this.completeMultipartUpload();
        }
    }

}