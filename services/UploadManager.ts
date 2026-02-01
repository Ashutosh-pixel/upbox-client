import { createChunks } from "@/lib/utils";
import axios from "axios";

export default class UploadManager {

    private uploadQueue = new Map();
    private dispatch = null;
    private baseUrl: string;
    private file: File;
    private fileName: string;
    private userID: string;
    private parentID: string | null;
    private fileSize: number;
    private chunkSize: number = 5 * 1024 * 1024;
    private totalParts: number;
    private index: number;
    private chunks: Blob[] = [];
    private fileID: string | undefined;
    private uploadParts: { PartNumber: number; ETag: any; }[] = [];
    private metadata: any = null;

    public constructor(index: number, baseUrl: string, file: File, fileName: string, userID: string, parentID: string | null) {
        this.baseUrl = baseUrl;
        this.file = file;
        this.fileName = fileName.trim();
        this.userID = userID;
        this.parentID = parentID;
        this.fileSize = file.size;
        const { totalParts, chunks } = createChunks(file, this.chunkSize);
        this.chunks = chunks;
        this.totalParts = totalParts;
        this.index = index;
    }


    private async saveFileMetadataToDB() {
        const fileName = this.fileName;
        const userID = this.userID;
        const fileSize = this.fileSize;
        const totalParts = this.totalParts;
        const chunkSize = this.chunkSize;
        const fileType = this.file.type;
        const parentID = this.parentID;

        try {
            const initRes = await axios.post(`${this.baseUrl}/user/uploadfile`, { fileName, userID, fileSize, totalParts, chunkSize, fileType, parentID });
            const uploadId = initRes.data.uploadId;
            const storagePath = initRes.data.storagePath;
            this.fileID = initRes.data.fileID;
            this.uploadQueue.set(this.fileID, { uploadId, fileName, userID, fileSize, totalParts, chunkSize, fileType, parentID, storagePath });
        } catch (error) {
            console.log('failed to create filemetadata in database', error);
        }
    }

    public async uploadFile() {
        try {
            await this.saveFileMetadataToDB();

            console.log('uploadfileafter', this.fileID, this.uploadQueue)

            if (!this.fileID) {
                return;
            }

            this.metadata = this.uploadQueue.get(this.fileID);

            const CONCURRENCY = 3;
            const workers = [];

            for (let i = 0; i < CONCURRENCY; i++) {
                workers.push(this.worker());
            }

            await Promise.all(workers);
            this.rebuildFile();
        } catch (error) {
            console.log('file upload failed', error);
        }
    }

    private async worker() {

        while (this.index < this.totalParts) {
            const current = this.index;
            this.index++;

            await this.uploadChunks(current);
        }
    }

    private async uploadChunks(current: number) {

        let i = current;

        // Step:3 get presigned urls for each parts from backend server
        const res = await fetch(
            `${this.baseUrl}/user/file/upload/url?fileName=${this.fileName}&uploadId=${this.metadata.uploadId}&storagePath=${this.metadata.storagePath}&partNumber=${i + 1}`,
        );
        const { url } = await res.json();

        // Step:4 upload chunks to s3
        const uploadRes = await axios.put(url, this.chunks[i]);

        const eTag = uploadRes.headers["etag"] || uploadRes.headers["Etag"];
        this.uploadParts.push({ PartNumber: i + 1, ETag: eTag });

        const uploadPartInfo = { PartNumber: i + 1, ETag: eTag };

        // Step:5 make a record in database
        const userID = this.userID;
        const fileName = this.fileName;
        const uploadId = this.metadata.uploadId;
        const fileID = this.fileID;
        const fileSize = this.fileSize
        const chunkSize = this.chunkSize;
        const totalParts = this.totalParts;

        await axios.post(
            `${this.baseUrl}/user/file/uploadsession/uploadparts`,
            { uploadPartInfo, userID, fileName: fileName, uploadId, fileID, fileSize, chunkSize, totalParts },
        );
    }

    private async rebuildFile() {

        // Step:6 complete upload
        const uploadId = this.metadata.uploadId;
        const storagePath = this.metadata.storagePath;
        const fileID = this.fileID;

        const finalRes = await axios.post(
            `${this.baseUrl}/user/file/upload/complete`,
            { uploadId, parts: this.uploadParts.sort((a, b) => a.PartNumber - b.PartNumber), storagePath, fileID },
        );
        alert(finalRes.data.message || finalRes.data.error);
    }
}