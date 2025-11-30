'use client'
import React from "react";
import { useState } from "react";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
import { upload } from "@/functions/file/singleFileUpload";
import { resume } from "@/functions/file/resumeSingleFile";

type fileUploadProp = {
    parentID: string | null
}

const FileUpload: React.FC<fileUploadProp> = ({ parentID }) => {

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadId, setUploadId] = useState<string>('');
    const [fileID, setFileID] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [userID] = useState<string>("681cbca24c31bfa9b698a961");
    
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    return (
        <div>
            <input type="file" onChange={(e) => {
                if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                }
            }} />
            <button onClick={() => upload(API_BASE_URL, file, userID, parentID, setUploading, setFileID, setUploadId, setFileName)}>Upload</button>
            {uploading ? <CircularProgressWithLabel value={progress} /> : null}
            <div>
                <button onClick={()=> resume(API_BASE_URL, uploadId, fileName, userID, fileID, file, setFileName, setUploadId)}>Resume</button>
            </div>
        </div>
    )
}

export default FileUpload
