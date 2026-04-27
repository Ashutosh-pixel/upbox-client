'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import FolderUpload from '@/components/folder/FolderUpload';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import FileContainer from "@/components/sidebar/File";
import { fileMetaData, folder, renameResponse } from "@/types/response";
import { pasteFile } from '@/functions/file/pasteFile';
import { uploadManager } from '@/services/UploadManager';
import ProgressBar from '@/components/progressBar/ProgressBar';
import { getAccessToken } from '@/lib/token';
import { useAuth } from '@/components/context/AuthContext';

const Page = () => {
    const [uploading, setUploading] = useState<boolean>(false);

    const router = useRouter();

    // files and folders creates and uploads
    const [fileResponse, setFileResponse] = useState<fileMetaData[]>([]);
    const [folderResponse, setFolderResponse] = useState<folder[]>([]);
    const [fileRenameResponse, setFileRenameResponse] = useState<renameResponse[]>([]);

    const { isAuthenticated, loading } = useAuth();


    const params = useParams();
    const folderPath = Array.isArray(params.folder) ? params.folder : []

    const parentId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

    const clipboard: any = useSelector((state: RootState) => state.clipboard);

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (loading || !isAuthenticated) {
            return;
        }

        const eventsource = new EventSource(`${API_BASE_URL}/connection?token=${getAccessToken()}`);

        eventsource.addEventListener('fileUploaded', (event) => {
            const response = JSON.parse(event.data);
            console.log("FILECOPY", event.data);
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

        eventsource.addEventListener('fileRenamed', (event) => {
            const response = JSON.parse(event.data);
            setFileRenameResponse(response);
            console.log("RENAMED", event.data);
        })

        return () => eventsource.close();

    }, [loading, isAuthenticated])

    // useEffect(() => {
    //     const eventsource = new EventSource(`${API_BASE_URL}/connection?token=${getAccessToken()}`);

    //     eventsource.addEventListener('fileUploaded', (event) => {
    //         const response = JSON.parse(event.data);
    //         setFileResponse(response);
    //     })

    //     eventsource.addEventListener('folderCreated', (event) => {
    //         const response = JSON.parse(event.data);
    //         setFolderResponse(response);
    //     })

    //     eventsource.addEventListener('folderUploaded', (event) => {
    //         const response = JSON.parse(event.data);
    //         setFolderResponse(response);
    //     })

    //     eventsource.addEventListener('fileRenamed', (event) => {
    //         const response = JSON.parse(event.data);
    //         setFileRenameResponse(response);
    //     })

    //     return () => eventsource.close();

    // }, [])

    // if (loading) return <p>Loading....</p>

    return (
        <div>
            <FolderCreate parentID={parentId} />

            {/* Button */}
            <FileUpload parentID={parentId} />

            <div><button className="cursor-pointer" onClick={() => pasteFile(clipboard, uploading, parentId, setUploading)}>Paste</button></div>

            {/* Button */}
            <FolderUpload parentID={parentId} />

            <FolderContainer key={parentId} parentID={parentId} folderResponse={folderResponse} />
            {/* <Image key={`img-${parentId}`} userID={userID} parentID={parentId} /> */}
            <FileContainer parentID={parentId} fileResponse={fileResponse} fileRenameResponse={fileRenameResponse} />

            <ProgressBar />
        </div>
    )
}

export default Page;
