import { selectedFiles, selectedFolders } from "@/types/folder";
import React, {useEffect, useRef, useState} from "react";
import { processFileUpload } from "@/functions/folder/folderUpload";
import { handleUploadFolders } from "@/functions/folder/uploadFolders";

type SelectedFolderProps = {
    parentID: string | null,
    userID: string
}

const FolderUpload: React.FC<SelectedFolderProps> = ({parentID, userID}) => {

    const [selectedFiles, setSelectedFiles] = useState<selectedFiles[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<selectedFolders[]>([]);
    const [uploadId, setUploadId] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        console.log(selectedFiles, selectedFolders);
    }, [selectedFiles, selectedFolders])

    return <div>
        <input type="file" webkitdirectory="true" onChange={() => processFileUpload(event, parentID, setSelectedFiles, setSelectedFolders)} ref={fileInputRef}/>
        <button onClick={()=>handleUploadFolders(API_BASE_URL, fileInputRef, userID, parentID, selectedFiles, selectedFolders, setUploadId, setFileName, setUploading)}>Upload Folder</button>
    </div>
}

export default FolderUpload
