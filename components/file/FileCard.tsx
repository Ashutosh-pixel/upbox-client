// FileCard.tsx (Updated - removed hover actions, fixed document display)
import { copyFile } from '@/functions/file/copyFile';
import { getFileURL } from '@/functions/file/fetchFileURL';
import { dateFormat } from '@/lib/utils'
import { fileMetaData } from '@/types/response'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from "react-redux";
import { Copy, Calendar, Clock, HardDrive, File, FileImage, FileVideo, FileText, FileArchive, Play, X, FileSpreadsheet, Presentation, Eye, Download, PenLine, Share2, Trash2 } from 'lucide-react';
import DropdownMenu, { MenuAction } from '../menu/DropDownMenu';
import FileDetailsModal from '../menu/FileDetailsModel';
import RenameModal from '../rename/Rename';
import Rename from '../rename/Rename';
import toast from 'react-hot-toast';

interface filemetadataProp {
    fileMetadata: fileMetaData
}

const FileCard: React.FC<filemetadataProp> = ({ fileMetadata }) => {
    const [fileURL, setFileURL] = useState<string>("");
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
    const [showImageModal, setShowImageModal] = useState<boolean>(false);
    const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
    const [videoThumbnail, setVideoThumbnail] = useState<string>("");
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalVideoRef = useRef<HTMLVideoElement>(null);
    const dispatch = useDispatch();
    const url: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [showRenameModal, setShowRenameModal] = useState<boolean>(false);

    // Fetch file URL
    useEffect(() => {
        if (fileMetadata?._id) {
            getFileURL(url, fileMetadata, setFileURL);
        }
    }, [fileMetadata]);

    // Generate video thumbnail when fileURL is available for video files
    useEffect(() => {
        if (fileURL && fileMetadata.type.startsWith('video/') && !videoThumbnail && !isGeneratingThumbnail) {
            generateVideoThumbnail();
        }
    }, [fileURL, fileMetadata.type]);

    const generateVideoThumbnail = async () => {
        setIsGeneratingThumbnail(true);

        // Create a temporary video element
        const tempVideo = document.createElement('video');
        tempVideo.crossOrigin = "anonymous";
        tempVideo.preload = 'metadata';
        tempVideo.src = fileURL;

        // Wait for metadata to load
        await new Promise((resolve) => {
            tempVideo.addEventListener('loadedmetadata', resolve, { once: true });
            tempVideo.addEventListener('error', () => {
                console.error('Error loading video metadata');
                resolve(null);
            }, { once: true });
        });

        // Set to 1 second or 10% of duration
        const seekTime = Math.min(1, tempVideo.duration * 0.1);
        tempVideo.currentTime = seekTime;

        // Wait for seek to complete
        await new Promise((resolve) => {
            tempVideo.addEventListener('seeked', resolve, { once: true });
            tempVideo.addEventListener('error', () => {
                console.error('Error seeking video');
                resolve(null);
            }, { once: true });
        });

        // Create canvas and capture frame
        try {
            const canvas = document.createElement('canvas');
            canvas.width = tempVideo.videoWidth;
            canvas.height = tempVideo.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
            setVideoThumbnail(thumbnailUrl);
        } catch (error) {
            console.error('Error generating thumbnail:', error);
        } finally {
            tempVideo.remove();
            setIsGeneratingThumbnail(false);
        }
    };

    const getFileIcon = (fileType: string, filename?: string) => {
        if (!fileType) return <File className="w-16 h-16 text-gray-400" />;

        // Images
        if (fileType.startsWith('image/')) return <FileImage className="w-16 h-16 text-blue-500" />;

        // Videos
        if (fileType.startsWith('video/')) return <FileVideo className="w-16 h-16 text-purple-500" />;

        // Check file extension for better detection
        const extension = filename?.split('.').pop()?.toLowerCase() || '';

        // Documents based on MIME type or extension
        if (fileType === 'application/pdf' || extension === 'pdf')
            return <FileText className="w-16 h-16 text-red-500" />;

        if (fileType === 'application/vnd.ms-excel' || extension === 'xls')
            return <FileSpreadsheet className="w-16 h-16 text-green-600" />;

        if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || extension === 'xlsx')
            return <FileSpreadsheet className="w-16 h-16 text-green-600" />;

        if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || extension === 'pptx' || extension === 'ppt')
            return <Presentation className="w-16 h-16 text-orange-600" />;

        if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx' || extension === 'doc')
            return <FileText className="w-16 h-16 text-blue-600" />;

        if (fileType === 'application/msword' || extension === 'doc')
            return <FileText className="w-16 h-16 text-blue-600" />;

        // Text files
        if (fileType === 'text/plain' || extension === 'txt')
            return <FileText className="w-16 h-16 text-gray-600" />;

        // Archives
        if (fileType.includes('zip') || fileType.includes('rar') || extension === 'zip' || extension === 'rar')
            return <FileArchive className="w-16 h-16 text-yellow-600" />;

        // PSD files
        if (extension === 'psd')
            return <FileImage className="w-16 h-16 text-blue-400" />;

        return <File className="w-16 h-16 text-gray-400" />;
    };

    const getFilePrefix = (fileType: string, filename?: string) => {
        if (!fileType) return "Document";
        if (fileType.startsWith('image/')) return "Gallery";
        if (fileType.startsWith('video/')) return "Video";

        const extension = filename?.split('.').pop()?.toLowerCase() || '';

        if (fileType === 'application/pdf' || extension === 'pdf') return "PDF";
        if (fileType.includes('word') || extension === 'doc' || extension === 'docx') return "Doc";
        if (fileType.includes('excel') || extension === 'xls' || extension === 'xlsx') return "Sheet";
        if (fileType.includes('presentation') || extension === 'ppt' || extension === 'pptx') return "Slides";
        if (extension === 'txt') return "Text";
        if (extension === 'psd') return "Photoshop";
        return "File";
    };

    const formatFileName = (filename: string, fileType: string) => {
        const prefix = getFilePrefix(fileType, filename);
        const maxLength = 25;
        let displayName = filename.length > maxLength
            ? filename.substring(0, maxLength) + '...'
            : filename;
        return `${prefix}-${displayName}`;
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "just now";
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return dateFormat(dateString);
    };

    const handlePlayVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowVideoModal(true);
    };

    const handleViewImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowImageModal(true);
    };

    const handleViewDocument = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDocumentModal(true);
    };

    const closeVideoModal = () => {
        if (modalVideoRef.current) {
            modalVideoRef.current.pause();
        }
        setShowVideoModal(false);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };

    const closeDocumentModal = () => {
        setShowDocumentModal(false);
    };

    const getDocumentPreviewText = (fileType: string, filename?: string) => {
        const extension = filename?.split('.').pop()?.toLowerCase() || '';

        switch (fileType) {
            case 'application/pdf': return 'PDF Document';
            case 'application/vnd.ms-excel': return 'Excel Spreadsheet';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'Excel Spreadsheet';
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'PowerPoint Presentation';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'Word Document';
            case 'application/msword': return 'Word Document';
            case 'text/plain': return 'Text File';
            default:
                if (extension === 'xls' || extension === 'xlsx') return 'Excel Spreadsheet';
                if (extension === 'doc' || extension === 'docx') return 'Word Document';
                if (extension === 'ppt' || extension === 'pptx') return 'PowerPoint Presentation';
                if (extension === 'pdf') return 'PDF Document';
                if (extension === 'txt') return 'Text File';
                if (extension === 'psd') return 'Photoshop Document';
                return 'Document';
        }
    };

    const getDocumentViewerUrl = (fileType: string, fileUrl: string, filename?: string) => {
        const encodedUrl = encodeURIComponent(fileUrl);
        const extension = filename?.split('.').pop()?.toLowerCase() || '';

        // For PDF files
        if (fileType === 'application/pdf' || extension === 'pdf') {
            return (
                <iframe
                    src={`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`}
                    className="w-full h-full"
                    title="PDF Viewer"
                />
            );
        }

        // For Microsoft Office files
        const officeTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.ms-powerpoint'
        ];

        if (officeTypes.includes(fileType) || ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'].includes(extension)) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
                    className="w-full h-full"
                    title="Office Document Viewer"
                />
            );
        }

        // For text files
        if (fileType === 'text/plain' || extension === 'txt') {
            return (
                <iframe
                    src={fileUrl}
                    className="w-full h-full"
                    title="Text File Viewer"
                />
            );
        }

        // Fallback
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                {getFileIcon(fileType, filename)}
                <p className="text-gray-600 mt-4 mb-4">Preview not available for this file type</p>
                <a
                    href={fileUrl}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Download File
                </a>
            </div>
        );
    };

    const renderFile = (fileType: string) => {
        if (!fileType || !fileURL) {
            return (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                    {getFileIcon(fileType, fileMetadata.filename)}
                    <span className='text-xs text-gray-500 mt-2'>No preview</span>
                </div>
            )
        }

        // Handle Images
        if (fileType.startsWith('image/')) {
            return (
                <>
                    {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="animate-pulse">
                                {getFileIcon(fileType, fileMetadata.filename)}
                            </div>
                        </div>
                    )}
                    <img
                        src={fileURL}
                        alt={fileMetadata.filename}
                        className={`rounded-xl object-cover w-full h-full transition-opacity duration-300 cursor-pointer ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => console.error('Error loading image')}
                        onClick={handleViewImage}
                    />
                </>
            )
        }

        // Handle Videos
        if (fileType.startsWith('video/')) {
            return (
                <div className="relative w-full h-full">
                    {/* Video Thumbnail */}
                    {videoThumbnail ? (
                        <img
                            src={videoThumbnail}
                            alt={fileMetadata.filename}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {isGeneratingThumbnail ? (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                                    <span className='text-xs text-gray-500'>Loading preview...</span>
                                </div>
                            ) : (
                                <div className="text-center">
                                    {getFileIcon(fileType, fileMetadata.filename)}
                                    <span className='text-xs text-gray-500 mt-2 block'>Video ready</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={handlePlayVideo}
                            className="bg-white bg-opacity-90 rounded-full p-4 transform transition-transform hover:scale-110 shadow-lg"
                            title="Play video"
                        >
                            <Play className="w-8 h-8 text-purple-600 fill-purple-600" />
                        </button>
                    </div>
                </div>
            )
        }

        // Handle Documents - Show Icons
        return (
            <div
                className="relative w-full h-full cursor-pointer group/document"
                onClick={handleViewDocument}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
                    {/* Large File Icon */}
                    {getFileIcon(fileType, fileMetadata.filename)}

                    {/* File Extension Badge */}
                    <div className="mt-4 text-center">
                        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm">
                            {fileMetadata.filename.split('.').pop()?.toUpperCase() || 'FILE'}
                        </span>
                    </div>

                    {/* File Name Preview */}
                    <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500 line-clamp-2">
                            {fileMetadata.filename}
                        </span>
                    </div>
                </div>
            </div>
        )
    };

    // Handle keyboard events for modals
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showImageModal && e.key === 'Escape') {
                closeImageModal();
            }
            if (showDocumentModal && e.key === 'Escape') {
                closeDocumentModal();
            }
            if (showVideoModal && e.key === 'Escape') {
                closeVideoModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showImageModal, showDocumentModal, showVideoModal]);


    // Define menu actions before the return statement
    const menuActions: MenuAction[] = [
        {
            id: 'details',
            label: 'Details',
            icon: <Eye className="w-4 h-4" />,
            onClick: (e) => {
                e.stopPropagation();
                setShowDetailsModal(true);
            }
        },
        {
            id: 'copy',
            label: 'Copy',
            icon: <Copy className="w-4 h-4" />,
            onClick: async (e) => {
                try {
                    await copyFile(fileMetadata, dispatch);
                    toast.success(`${fileMetadata.filename} copied to clipboard!`, {
                        duration: 2000,
                        position: 'bottom-right',
                    });
                } catch (error) {
                    toast.error(`Failed to copy ${fileMetadata.filename}`, {
                        duration: 2000,
                        position: 'bottom-right',
                    });
                }
            }
        },
        {
            id: 'download',
            label: 'Download',
            icon: <Download className="w-4 h-4" />,
            onClick: (e) => {
            }
        },
        {
            id: 'rename',
            label: 'Rename',
            icon: <PenLine className="w-4 h-4" />,
            onClick: (e) => {
                e.stopPropagation();
                setShowRenameModal(true);
            }
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 className="w-4 h-4" />,
            danger: true,
            onClick: (e) => {
            }
        }
    ];

    return (
        <>
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">


                {/* File Preview Area */}
                <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">

                    {renderFile(fileMetadata.type)}
                </div>

                {/* File Info */}
                <div className="p-4">
                    {/* File Name */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight flex-1">
                            {formatFileName(fileMetadata.filename, fileMetadata.type)}
                        </h3>

                        {/* Three Dots Button - Bottom Right next to filename */}
                        <div className="flex-shrink-0">
                            <DropdownMenu actions={menuActions} />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">Created {dateFormat(fileMetadata.uploadTime)}</span>
                        </div>

                        {fileMetadata.size && (
                            <div className="flex items-center gap-2">
                                <HardDrive className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{formatFileSize(fileMetadata.size)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-300"
                    onClick={closeVideoModal}
                >
                    <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeVideoModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <video
                            ref={modalVideoRef}
                            className="w-full rounded-lg shadow-2xl"
                            controls
                            autoPlay
                            src={fileURL}
                        >
                            Your browser does not support the video tag.
                        </video>

                        <div className="mt-4 text-white">
                            <h3 className="text-lg font-semibold">{fileMetadata.filename}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                <span>{formatFileSize(fileMetadata.size)}</span>
                                <span>Created: {dateFormat(fileMetadata.uploadTime)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-300"
                    onClick={closeImageModal}
                >
                    <div className="relative max-w-7xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex items-center justify-center">
                            <img
                                src={fileURL}
                                alt={fileMetadata.filename}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        <div className="mt-4 text-white">
                            <h3 className="text-lg font-semibold">{fileMetadata.filename}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                <span>{formatFileSize(fileMetadata.size)}</span>
                                <span>Created: {dateFormat(fileMetadata.uploadTime)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Modal */}
            {showDocumentModal && fileURL && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-95 transition-all duration-300"
                    onClick={closeDocumentModal}
                >
                    {/* Close button - fixed position top-right */}
                    <button
                        onClick={closeDocumentModal}
                        className="fixed top-4 right-4 text-white hover:text-gray-300 transition-colors bg-gray-800 hover:bg-gray-700 rounded-full p-2 z-50 shadow-lg"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="h-full flex flex-col p-4 pt-16" onClick={(e) => e.stopPropagation()}>
                        {/* Document Viewer */}
                        <div className="flex-1 min-h-0 bg-white rounded-lg overflow-hidden shadow-2xl">
                            {getDocumentViewerUrl(fileMetadata.type, fileURL, fileMetadata.filename)}
                        </div>

                        {/* Footer with file info */}
                        <div className="mt-3 text-white bg-black bg-opacity-50 rounded-lg p-3">
                            <p className="font-medium truncate">{fileMetadata.filename}</p>
                            <div className="flex gap-4 mt-1 text-xs text-gray-300">
                                <span>{formatFileSize(fileMetadata.size)}</span>
                                <span>Created: {dateFormat(fileMetadata.uploadTime)}</span>
                                <span className="capitalize">{getDocumentPreviewText(fileMetadata.type, fileMetadata.filename)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            <FileDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                fileMetadata={fileMetadata}
                fileURL={fileURL}
            />

            {/* Rename Modal */}
            {showRenameModal && (
                <Rename
                    fileID={fileMetadata._id}
                    currentFileName={fileMetadata.filename}
                    onClose={() => setShowRenameModal(false)}
                    onRenameSuccess={() => {
                        // Optional: Refresh file list or show success toast
                        console.log('Rename successful');
                    }}
                />
            )}
        </>
    )
}

export default FileCard;