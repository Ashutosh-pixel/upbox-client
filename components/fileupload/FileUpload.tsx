'use client'
import React from "react";
import { useState } from "react";
import axios from "axios";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
import { createChunks } from "@/lib/utils";

type fileUploadProp = {
    parentID: string | null
}

const FileUpload: React.FC<fileUploadProp> = ({ parentID }) => {

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [userID] = useState<string>("681cbca24c31bfa9b698a961");

    async function upload() {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userID', userID);

        if (parentID) {
            formData.append('parentID', parentID)
        }

        console.log('formData', formData.get("userID"), formData.get("file"))
        try {
            setUploading(true);
            // const response = await axios.post('http://localhost:3001/user/uploadfile', formData, {
            //     onUploadProgress: (progressEvent) => {
            //         const { loaded, total } = progressEvent;
            //         if (typeof total === "number" && total > 0) {
            //             const percentCompleted = Math.floor((loaded * 100) / total);
            //             console.log('loaded & total', loaded, total);
            //             setProgress(percentCompleted);
            //         }
            //     },
            // })
            // alert(response.data.message || response.data.error)
            
            // Step:1 setup connection with s3 by backend server
            const fileName = file.name;
            const fileSize = file.size;
            const chunkSize = 5*1024*1024;
            const {totalParts} = createChunks(file,chunkSize);
            const initRes = await axios.post('http://localhost:3001/user/file/upload/initiate', {fileName, userID, fileSize, totalParts, chunkSize});
            const uploadId = await initRes.data.uploadId;

            // Setp:2 split file into chunks
            const {chunks} = createChunks(file);
            const uploadParts = [];
            
            let i = 0;
            while (i < chunks.length) {
                const res = await fetch(`http://localhost:3001/user/file/upload/url?fileName=${fileName}&uploadId=${uploadId}&partNumber=${i + 1}`);
                const { url } = await res.json();

                // Step:3 upload chunks to s3
                const uploadRes = await axios.put(url, chunks[i]);

                const eTag = uploadRes.headers['etag'] || uploadRes.headers['Etag'];
                uploadParts.push({ PartNumber: i + 1, ETag: eTag });

                const uploadPartInfo = { partNumber: i + 1, ETag: eTag };

                await axios.post('http://localhost:3001/user/file/uploadsession/uploadparts', { uploadPartInfo, userID, fileName, uploadId });

                i++;
            }


            // Step:4 complete upload
            const finalRes = await axios.post('http://localhost:3001/user/file/upload/complete', {fileName, uploadId, parts: uploadParts, userID});
            alert(finalRes.data.message || finalRes.data.error);

        } catch (error) {
            console.log('error while uploading', error);
        }
        finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <input type="file" onChange={(e) => {
                if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                }
            }} />
            <button onClick={upload}>Upload</button>
            {uploading ? <CircularProgressWithLabel value={progress} /> : null}
        </div>
    )
}

export default FileUpload