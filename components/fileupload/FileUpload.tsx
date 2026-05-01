'use client'
import React, { useState, useRef } from "react";
import { upload } from "@/functions/file/singleFileUpload";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { FileUp, Upload, X } from 'lucide-react';

type fileUploadProp = {
    parentID: string | null,
    setSpaceExceed: React.Dispatch<React.SetStateAction<boolean>>
}

const FileUpload: React.FC<fileUploadProp> = ({ parentID, setSpaceExceed }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const renameArray = useSelector((state: RootState) => state.renameArray);
    const dispatch = useDispatch();
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        await upload(API_BASE_URL, file, file.name, parentID, setSpaceExceed, dispatch);
        setIsUploading(false);
        setShowConfirm(false);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        setShowConfirm(true);
                        e.target.value = '';
                    }
                }}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <FileUp className="w-4 h-4" />
                <span className="text-sm">Upload File</span>
            </button>

            {/* Simple Confirm Modal */}
            {showConfirm && file && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-96 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Confirm Upload</h3>
                            <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 break-all">{file.name}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default FileUpload