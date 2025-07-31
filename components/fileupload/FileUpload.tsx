'use client'
import React from "react";
import { useState } from "react";
import axios from "axios";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";

type fileUploadProp = {
    parentID: string | null
}

const FileUpload: React.FC<fileUploadProp> = ({ parentID }) => {

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [userID] = useState<string>("68172b1df87d1cb0c096e49f");

    async function upload() {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userID', userID);

        if (parentID) {
            formData.append('parentID', parentID)
        }

        console.log('formData', formData.get("userID"))
        try {
            setUploading(true);
            const response = await axios.post('http://localhost:3001/user/uploadfile', formData, {
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    if (typeof total === "number" && total > 0) {
                        const percentCompleted = Math.floor((loaded * 100) / total);
                        console.log('loaded & total', loaded, total);
                        setProgress(percentCompleted);
                    }
                },
            })
            alert(response.data.message || response.data.error)
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