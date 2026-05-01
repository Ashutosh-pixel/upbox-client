'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import FolderUpload from '@/components/folder/FolderUpload';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import FileContainer from "@/components/sidebar/File";
import { fileMetaData, folder, renameResponse } from "@/types/response";
import { pasteFile } from '@/functions/file/pasteFile';
import ProgressBar from '@/components/progressBar/ProgressBar';
import { getAccessToken } from '@/lib/token';
import { useAuth } from '@/components/context/AuthContext';
import { Clipboard } from 'lucide-react';
import FileDuplicateWindowPop from '@/components/duplicate/FileDuplicateWindowPop';

const Page = () => {
    const [uploading, setUploading] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const [fileResponse, setFileResponse] = useState<fileMetaData[]>([]);
    const [folderResponse, setFolderResponse] = useState<folder[]>([]);
    const [fileRenameResponse, setFileRenameResponse] = useState<renameResponse[]>([]);
    const [spaceExceed, setSpaceExceed] = useState<boolean>(false);

    const { isAuthenticated, loading } = useAuth();
    const params = useParams();
    const folderPath = Array.isArray(params.folder) ? params.folder : []
    const parentId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;
    const clipboard: any = useSelector((state: RootState) => state.clipboard);
    const renameArray = useSelector((state: RootState) => state.renameArray);
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (loading || !isAuthenticated) return;

        const eventsource = new EventSource(`${API_BASE_URL}/connection?token=${getAccessToken()}`);

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

        eventsource.addEventListener('fileRenamed', (event) => {
            const response = JSON.parse(event.data);
            setFileRenameResponse(response);
        })

        return () => eventsource.close();
    }, [loading, isAuthenticated, API_BASE_URL]);

    return (
        <div className="p-6">
            {spaceExceed && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    ⚠️ Storage full
                </div>
            )}

            <div className="flex gap-3 mb-6 flex-wrap">
                <FolderCreate parentID={parentId} />
                <FileUpload parentID={parentId} setSpaceExceed={setSpaceExceed} />
                <FolderUpload parentID={parentId} setSpaceExceed={setSpaceExceed} />
                <button
                    onClick={() => pasteFile(clipboard, uploading, parentId, setUploading, setSpaceExceed)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Clipboard className="w-4 h-4" />
                    <span className="text-sm">Paste</span>
                </button>
            </div>

            <FolderContainer key={parentId} parentID={parentId} folderResponse={folderResponse} />
            <FileContainer parentID={parentId} fileResponse={fileResponse} fileRenameResponse={fileRenameResponse} />

            <ProgressBar />

            {/* Global Duplicate Dialog  */}
            <FileDuplicateWindowPop renameArray={renameArray} />
        </div>
    )
}

export default Page;