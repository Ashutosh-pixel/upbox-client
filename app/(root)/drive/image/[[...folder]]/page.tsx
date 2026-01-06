'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import FolderUpload from '@/components/folder/FolderUpload';
import Image from '@/components/sidebar/Image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import axios from "axios";
import FileContainer from "@/components/sidebar/File";
import { fileMetaData, folder } from "@/types/response";
import { pasteFile } from '@/functions/file/pasteFile';

const page = () => {
    const [uploading, setUploading] = useState<boolean>(false);

    // files and folders creates and uploads
    const [fileResponse, setFileResponse] = useState<fileMetaData[]>([]);
    const [folderResponse, setFolderResponse] = useState<folder[]>([]);


    const params = useParams();
    const folderPath = Array.isArray(params.folder) ? params.folder : []

    const userID = "681cbca24c31bfa9b698a961";
    const parentId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

    const clipboard: any = useSelector((state: RootState) => state.clipboard);

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        const eventsource = new EventSource(`http://localhost:3001/connection/${userID}`);

        eventsource.addEventListener('fileUploaded', (event) => {
            const response = JSON.parse(event.data);
            setFileResponse(response);
        })

        eventsource.addEventListener('folderCreated', (event) => {
            const response = JSON.parse(event.data);
            setFolderResponse(response);
        })

        eventsource.addEventListener('folderUploaded', (event) => {
            const response = JSON.parse(event.data);
            setFolderResponse(response);
        })

        return () => eventsource.close();

    }, [])

    return (
        <div>
            <FolderCreate parentID={parentId} />

            {/* Button */}
            <FileUpload parentID={parentId} />

            <div><button className="cursor-pointer" onClick={() => pasteFile(API_BASE_URL, clipboard, uploading, parentId, setUploading)}>Paste</button></div>

            {/* Button */}
            <FolderUpload parentID={parentId} userID={userID} />

            <FolderContainer key={parentId} parentID={parentId} userID={userID} folderResponse={folderResponse} />
            {/* <Image key={`img-${parentId}`} userID={userID} parentID={parentId} /> */}
            <FileContainer userID={userID} parentID={parentId} fileResponse={fileResponse} />
        </div>
    )
}

export default page;
