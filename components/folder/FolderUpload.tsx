'use client'
import { selectedFiles, selectedFolders } from "@/types/folder";
import React, { useEffect, useRef, useState } from "react";
import { processFileUpload } from "@/functions/folder/folderUpload";
import { handleUploadFolders } from "@/functions/folder/uploadFolders";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { FolderUp, X } from 'lucide-react';

type SelectedFolderProps = {
    parentID: string | null,
    setSpaceExceed: React.Dispatch<React.SetStateAction<boolean>>
}

const FolderUpload: React.FC<SelectedFolderProps> = ({ parentID, setSpaceExceed }) => {
    const [selectedFiles, setSelectedFiles] = useState<selectedFiles[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<selectedFolders[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [showSummary, setShowSummary] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    const renameArray = useSelector((state: RootState) => state.renameArray);
    const dispatch = useDispatch();

    const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await processFileUpload(e, parentID, setSelectedFiles, setSelectedFolders);
        setShowSummary(true);
        e.target.value = '';
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0 && selectedFolders.length === 0) return;
        setUploading(true);
        await handleUploadFolders(API_BASE_URL, fileInputRef, parentID, selectedFiles, selectedFolders, setSpaceExceed, dispatch);
        setUploading(false);
        setShowSummary(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedFiles([]);
        setSelectedFolders([]);
    };

    const totalFiles = selectedFiles.length;
    const totalFolders = selectedFolders.length;

    return (
        <div>
            <input
                type="file"
                webkitdirectory="true"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFolderSelect}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <FolderUp className="w-4 h-4" />
                <span className="text-sm">Upload Folder</span>
            </button>

            {/* Simple Summary Modal */}
            {showSummary && (selectedFiles.length > 0 || selectedFolders.length > 0) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-96 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Upload Summary</h3>
                            <button onClick={() => setShowSummary(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-sm">📁 Folders: {totalFolders}</p>
                            <p className="text-sm">📄 Files: {totalFiles}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default FolderUpload