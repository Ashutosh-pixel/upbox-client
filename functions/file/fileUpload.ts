import { createChunks } from "@/lib/utils";
import axios from "axios";

export async function fileUpload(baseUrl: string, file: File | null, file_Name: string, userID: string, parentID: string | null, uploadId: string, storagePath: string, fileID: string) {
    try {

        if (!file) return;

        // Step:1 setup connection with backend server
        const fileName = file_Name.trim();
        const fileSize = file.size;
        const chunkSize = 5 * 1024 * 1024;
        const { totalParts } = createChunks(file, chunkSize);

        // Setp:2 split file into chunks
        const { chunks } = createChunks(file);
        const uploadParts = [];

        let i = 0;
        while (i < totalParts) {
            // TEMPORARY: Extra check to test the RESUME feature during development
            // if (i === 3) throw new Error("Simulated network failure");

            // Step:3 get presigned urls for each parts from backend server
            const res = await fetch(
                `${baseUrl}/user/file/upload/url?fileName=${fileName}&uploadId=${uploadId}&storagePath=${storagePath}&partNumber=${i + 1}`,
            );
            const { url } = await res.json();

            // Step:4 upload chunks to s3
            const uploadRes = await axios.put(url, chunks[i]);

            const eTag = uploadRes.headers["etag"] || uploadRes.headers["Etag"];
            uploadParts.push({ PartNumber: i + 1, ETag: eTag });

            const uploadPartInfo = { PartNumber: i + 1, ETag: eTag };

            // Step:5 make a record in database
            await axios.post(
                `${baseUrl}/user/file/uploadsession/uploadparts`,
                { uploadPartInfo, userID, fileName: fileName, uploadId, fileID, fileSize, chunkSize, totalParts },
            );

            i++;
        }

        // Step:6 complete upload
        const finalRes = await axios.post(
            `${baseUrl}/user/file/upload/complete`,
            { uploadId, parts: uploadParts, storagePath, fileID },
        );
        if (finalRes.data.location) {
            //   setFileName("");
            //   setUploadId("");
        }
        alert(finalRes.data.message || finalRes.data.error);
    } catch (err: any) {
        console.log("error while uploading", err.response);
    } finally {
        // setUploading(false);
    }
}