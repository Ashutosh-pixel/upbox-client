'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';
import { fetchFolders } from '@/functions/folder/fetchFolders';
import { Folder, FolderOpen, Calendar, Clock } from 'lucide-react';

type FolderProps = {
    parentID: string | null,
    folderResponse: folder[],
    fileType: string;
}

const FolderContainer: React.FC<FolderProps> = ({ parentID, folderResponse, fileType }) => {
    const [folders, setFolders] = useState<folder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchFolders(parentID, setFolders, setLoading);
    }, [parentID])

    useEffect(() => {
        if (folderResponse[0]?._id && folderResponse[0]?.parentID === parentID) {
            const exists = folders.some(folder => folder._id === folderResponse[0]._id);
            if (!exists) {
                setFolders((prev) => [...prev, folderResponse[0]]);
            }
        }
    }, [folderResponse, folders, parentID])

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleFolderClick = (folderId: string) => {
        // Build the correct path based on file type and current parent
        let basePath = '';

        switch (fileType) {
            case 'image':
                basePath = '/drive/image';
                break;
            case 'video':
                basePath = '/drive/video';
                break;
            case 'document':
                basePath = '/drive/document';
                break;
            default:
                basePath = '/drive';
        }

        // If we have a parentID (we're inside a folder), append to current path
        if (parentID) {
            // Get current path segments
            // const currentPath = window.location.pathname;
            router.push(`${basePath}/${folderId}`);
        } else {
            // Navigate to new folder in the base type route
            router.push(`${basePath}/${folderId}`);
        }
    };

    /*     const handleCopy = async (e: React.MouseEvent, folder: folder) => {
            e.stopPropagation();
            await copyFolder(folder, dispatch);
        };
     */
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200"></div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (folders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full p-6 mb-4">
                    <Folder className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No folders yet</h3>
                <p className="text-sm text-gray-500">Create a new folder to organize your files</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
            {folders?.map((item: folder) => (
                <div
                    key={item._id}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
                    onMouseEnter={() => setHoveredFolder(item._id)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    onClick={() => handleFolderClick(item._id)}
                >
                    {/* Folder Preview Area */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
                        {/* Folder Icon */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {hoveredFolder === item._id ? (
                                <FolderOpen className="w-20 h-20 text-blue-500 transition-all duration-300 transform scale-110" />
                            ) : (
                                <Folder className="w-20 h-20 text-blue-500 transition-all duration-300" />
                            )}

                            {/* Folder decoration - paper effect */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent"></div>
                        </div>

                        {/* Item Count Badge (optional - if you have item count) */}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
                            📁 Folder
                        </div>
                    </div>

                    {/* Folder Info */}
                    <div className="p-4">
                        {/* Folder Name */}
                        <div className="mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                                {item.name}
                            </h3>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">Created {formatDate(item.uploadTime)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">Updated {formatDate(item.updatedAt)}</span>
                            </div>
                        </div>
                    </div>


                </div>
            ))}
        </div>
    )
}

export default FolderContainer;