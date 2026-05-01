// Rename.tsx
import { cancelRename, fileRename } from "@/functions/rename/fileRename";
import { useState, useEffect, useRef } from "react";
import { X, Check, FileText, AlertCircle, CheckCircle } from 'lucide-react';

type renameProps = {
    fileID: string;
    currentFileName?: string;
    onClose?: () => void;
    onRenameSuccess?: () => void;
}

const Rename = ({ fileID, currentFileName = "", onClose, onRenameSuccess }: renameProps) => {
    const [newName, setNewName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const controller = useRef<AbortController>(new AbortController());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentFileName) {
            const lastDot = currentFileName.lastIndexOf('.');
            if (lastDot > 0) {
                setNewName(currentFileName.substring(0, lastDot));
            } else {
                setNewName(currentFileName);
            }
        }

        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 100);
    }, [currentFileName]);

    const getFileExtension = () => {
        const lastDot = currentFileName.lastIndexOf('.');
        if (lastDot > 0) {
            return currentFileName.substring(lastDot);
        }
        return '';
    };

    const handleRename = async () => {
        const trimmedName = newName.trim();
        if (!trimmedName) {
            setErrorMessage("Name is required");
            return;
        }

        const extension = getFileExtension();
        const finalName = extension ? trimmedName + extension : trimmedName;

        if (finalName === currentFileName) {
            onClose?.();
            return;
        }

        const success = await fileRename(
            finalName,
            false,
            userID,
            fileID,
            setNewName,
            setIsLoading,
            setErrorMessage,
            setSuccessMessage,
            controller.current
        );

        if (success) {
            onRenameSuccess?.();
            setTimeout(() => {
                onClose?.();
            }, 1500);
        }
    };

    const handleCancel = () => {
        cancelRename(setNewName, setIsLoading, setErrorMessage, setSuccessMessage, controller.current);
        onClose?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleRename();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const userID = "681cbca24c31bfa9b698a961";

    return (
        <>
            {/* Backdrop - Same as FileDetailsModal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={handleCancel}
            >
                {/* Black Backdrop */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={handleCancel}
                />

                {/* Modal Content - Minimal style matching FileDetailsModal */}
                <div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Matches FileDetailsModal style */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* File Icon */}
                            <div className="w-12 h-12 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="w-full h-full">
                                    <path fill="#6C87FE" d="M57.5,31h-23c-1.4,0-2.5-1.1-2.5-2.5v-10c0-1.4,1.1-2.5,2.5-2.5h23c1.4,0,2.5,1.1,2.5,2.5v10 C60,29.9,58.9,31,57.5,31z"></path>
                                    <path fill="#8AA3FF" d="M59.8,61H12.2C8.8,61,6,58,6,54.4V17.6C6,14,8.8,11,12.2,11h18.5c1.7,0,3.3,1,4.1,2.6L38,24h21.8 c3.4,0,6.2,2.4,6.2,6v24.4C66,58,63.2,61,59.8,61z"></path>
                                    <path fill="#798BFF" d="M7.7,59c2.2,2.4,4.7,2,6.3,2h45c1.1,0,3.2,0.1,5.3-2H7.7z"></path>
                                </svg>
                            </div>

                            {/* Title */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Rename File</h3>
                                <p className="text-sm text-gray-500">Edit file name</p>
                            </div>
                        </div>

                        <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body - Simple minimal style */}
                    <div className="p-6">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-green-700">{successMessage}</span>
                            </div>
                        )}

                        {/* Input Field - Clean minimal design */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Name
                                </label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newName}
                                    placeholder="Enter new file name"
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                        if (errorMessage) setErrorMessage("");
                                        if (successMessage) setSuccessMessage("");
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errorMessage
                                            ? 'border-red-300 focus:ring-red-500'
                                            : successMessage
                                                ? 'border-green-300 focus:ring-green-500'
                                                : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                    disabled={isLoading}
                                />

                                {/* Extension hint */}
                                {getFileExtension() && (
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Extension <span className="font-mono text-gray-600">{getFileExtension()}</span> will be preserved
                                    </p>
                                )}

                                {/* Error Message */}
                                {errorMessage && (
                                    <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions - Simple buttons */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRename}
                                    disabled={isLoading || !!successMessage}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Renaming...</span>
                                        </>
                                    ) : successMessage ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Renamed!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Rename</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Rename;