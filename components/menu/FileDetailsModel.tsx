// components/FileDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import {
    X, Folder, File as FileIcon, Users, User, Calendar,
    Clock, HardDrive, MapPin, Eye, Download, Share2,
    Activity, Home, ChevronRight
} from 'lucide-react';
import { fileMetaData } from '@/types/response';
import { dateFormat } from '@/lib/utils';

interface FileDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileMetadata: fileMetaData;
    fileURL?: string;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
    isOpen,
    onClose,
    fileMetadata,
    fileURL
}) => {

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getFileTypeIcon = () => {
        const type = fileMetadata.type;
        if (type.startsWith('image/')) return 'Image';
        if (type.startsWith('video/')) return 'Video';
        if (type.includes('pdf')) return 'PDF';
        if (type.includes('word')) return 'Word Document';
        if (type.includes('excel')) return 'Excel Spreadsheet';
        if (type.includes('presentation')) return 'PowerPoint';
        return 'File';
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getLocationPath = () => {
        // Return the path names array from fileMetadata
        return fileMetadata.pathNames || [];
    };


    // Breadcrumb style
    const BreadcrumbLocation = () => {
        const pathArray = getLocationPath();

        if (!pathArray || pathArray.length === 0) {
            return (
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <div className="inline-flex items-center text-sm font-medium text-gray-700">
                                <Home className="w-4 h-4 mr-1 text-green-500" />
                                Root
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-1 text-gray-400">/</span>
                                <span className="text-sm font-medium text-blue-600">Current File</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            );
        }

        return (
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                    {/* Root */}
                    <li className="inline-flex items-center">
                        <div className="inline-flex items-center text-sm font-medium text-gray-700">
                            <Home className="w-4 h-4 mr-1 text-green-500" />
                            Root
                        </div>
                    </li>

                    {/* Folder path */}
                    {pathArray.map((item, index) => (
                        <li key={index}>
                            <div className="flex items-center">
                                <span className="mx-1 text-gray-400">/</span>
                                <div className="flex items-center">
                                    <Folder className={`w-4 h-4 mr-1 ${index === pathArray.length - 1 ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    <span className={`text-sm ${index === pathArray.length - 1 ? 'font-medium text-blue-600' : 'text-gray-600'
                                        }`}>
                                        {item}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}

                    {/* Current file */}
                    <li>
                        <div className="flex items-center">
                            <span className="mx-1 text-gray-400">/</span>
                            <div className="flex items-center">
                                <FileIcon className="w-4 h-4 mr-1 text-purple-500" />
                                <span className="text-sm font-medium text-purple-600">Current File</span>
                            </div>
                        </div>
                    </li>
                </ol>
            </nav>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

                {/* Modal Header */}
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

                        {/* File Title */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {fileMetadata.filename.split('.').slice(0, -1).join('.')}
                            </h3>
                            <p className="text-sm text-gray-500">{getFileTypeIcon()}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="space-y-4">
                        {/* Type */}
                        <div className="flex items-start py-3 border-b border-gray-50">
                            <div className="w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500">Type</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-gray-800">{getFileTypeIcon()}</span>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="flex items-start py-3 border-b border-gray-50">
                            <div className="w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500">Size</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-gray-800">{formatFileSize(fileMetadata.size)}</span>
                            </div>
                        </div>

                        {/* Location - Using Breadcrumb style (recommended) */}
                        <div className="flex items-start py-3 border-b border-gray-50">
                            <div className="w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500">Location</span>
                            </div>
                            <div className="flex-1">
                                <BreadcrumbLocation />
                            </div>
                        </div>

                        {/* Owner */}
                        <div className="flex items-start py-3 border-b border-gray-50">
                            <div className="w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500">Owner</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                        <User className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-gray-800">Me</span>
                                </div>
                            </div>
                        </div>

                        {/* Created */}
                        <div className="flex items-start py-3">
                            <div className="w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-gray-500">Created</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-gray-800">
                                    {dateFormat(fileMetadata.uploadTime)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileDetailsModal;