'use client'
import React, { useEffect } from "react";
import { useState } from "react";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
import { upload } from "@/functions/file/singleFileUpload";
import { resume } from "@/functions/file/resumeSingleFile";
import FileDuplicateWindowPop from "../duplicate/FileDuplicateWindowPop";
import { uploadManager } from "@/services/UploadManager";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

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

    const renameArray = useSelector((state: RootState) => state.renameArray);
    const dispatch = useDispatch();

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    // check duplicate upload
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

    useEffect(() => {
        console.log('renameArray', renameArray);
    }, [renameArray])

    return (
        <div>
            <input type="file" onChange={(e) => {
                if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                }
            }} />
            <button onClick={() => {
                const fileName = file ? file.name : "";
                upload(API_BASE_URL, file, fileName, parentID, setUploading, setFileID, setUploadId, setFileName, setIsDuplicate, dispatch)
            }}>Upload</button>
            <div>
                <button onClick={() => resume(uploadId, fileName, fileID, file, setFileName, setUploadId)}>Resume</button>
            </div>

            {renameArray && renameArray.length && <FileDuplicateWindowPop renameArray={renameArray} />}
        </div>
    )
}

export default FileUpload
