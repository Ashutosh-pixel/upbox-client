'use client'
import React, { useEffect } from "react";
import { useState } from "react";
import { upload } from "@/functions/file/singleFileUpload";
import FileDuplicateWindowPop from "../duplicate/FileDuplicateWindowPop";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

type fileUploadProp = {
    parentID: string | null,
    setSpaceExceed: React.Dispatch<React.SetStateAction<boolean>>
}

const FileUpload: React.FC<fileUploadProp> = ({ parentID, setSpaceExceed }) => {

    const [file, setFile] = useState<File | null>(null);

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
                upload(API_BASE_URL, file, fileName, parentID, setSpaceExceed, dispatch)
            }}>Upload</button>

            {renameArray && renameArray.length && <FileDuplicateWindowPop renameArray={renameArray} />}
        </div>
    )
}

export default FileUpload
