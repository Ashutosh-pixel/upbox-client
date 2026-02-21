import { createChunks } from "@/lib/utils";
import axios from "axios";

export default class UploadTask2 {

    private file: File;
    private fileName: string;
    private folderID: string;
    private fileSize: number;
    private fileType: string;
    private chunkSize: number = 5 * 1024 * 1024;
    private totalParts: number;
    private userID: string;
    private parentID: string | null;
    private pathIds: string[];
    private pathNames: string[];
    private storagePath: string;
    private uploadId: string = '';
    private fileID: string = '';
    private uploadQueue = new Map();
    private baseUrl: string;
    private metadata: any = null;
    private index: number;
    private chunks: Blob[] = [];
    private uploadParts: { PartNumber: number; ETag: any; }[] = [];

    constructor(index: number, baseUrl: string, file: File, name: string, folderID: string, userID: string, parentID: string | null, pathIds: string[], pathNames: string[], storagePath: string) {
        this.fileName = name;
        this.userID = userID;
        this.file = file;
        this.folderID = folderID;
        this.parentID = parentID;
        this.pathIds = pathIds;
        this.pathNames = pathNames;
        this.storagePath = storagePath;
        this.fileSize = file.size;
        this.fileType = file.type;
        const { totalParts, chunks } = createChunks(file, this.chunkSize);
        this.totalParts = totalParts;
        this.baseUrl = baseUrl;
        this.index = index;
        this.chunks = chunks;
    }

    private async saveFileMetadataToDB() {
        const fileName = this.fileName;
        const userID = this.userID;
        const fileSize = this.fileSize;
        const totalParts = this.totalParts;
        const chunkSize = this.chunkSize;
        const fileType = this.fileType;
        const parentID = this.parentID;
        const pathIds = this.pathIds;
        const pathNames = this.pathNames;
        const storagePath = this.storagePath;

        try {
            const initRes = await axios.post(`${this.baseUrl}/user/uploadfile/initiate`, {
                fileName,
                userID,
                fileSize,
                totalParts,
                chunkSize,
                fileType,
                parentID,
                pathIds,
                pathNames,
                storagePath
            });

            const uploadId = await initRes.data.uploadId;
            this.fileID = await initRes.data.fileID;

            this.uploadQueue.set(this.fileID, {
                uploadId, fileName, userID, fileSize, totalParts, chunkSize, fileType, parentID, storagePath, pathIds, pathNames
            });
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
            { uploadPartInfo, userID, fileName, uploadId, fileID, fileSize, chunkSize, totalParts },
        );
    }

    private async rebuildFile() {

        // Step:6 complete upload
        const uploadId = this.metadata.uploadId;
        const storagePath = this.metadata.storagePath;
        const fileID = this.fileID;
        const folderID = this.metadata.folderID;

        const finalRes = await axios.post(
            `${this.baseUrl}/user/file/upload/complete`,
            { uploadId, parts: this.uploadParts.sort((a, b) => a.PartNumber - b.PartNumber), storagePath, folderID, fileID },
        );
        alert(finalRes.data.message || finalRes.data.error);
    }
}