'use client'
import { uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { RootState } from "@/lib/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { pause } from "@/functions/progressBar/pause";
import { resume } from "@/functions/progressBar/resume";
import { cancel } from "@/functions/progressBar/cancel";
import { Pause, Play, XCircle, CheckCircle, Loader2, File, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from "react";
import { cleanUploadProgress } from "@/lib/redux/slice/fileUploadProgressSlice";

const ProgressBar = () => {
    const uploadProgress: uploadingProgress[] = useSelector((state: RootState) => state.fileUploadProgress);
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);

    // Auto-cleanup ONLY completed and aborted uploads from Redux after 3 seconds
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        uploadProgress.forEach(progress => {
            // Only clean if status is 'completed' or 'aborted'
            if (progress.status === 'completed' || progress.status === 'aborted') {
                const timer = setTimeout(() => {
                    dispatch(cleanUploadProgress(progress));
                }, 3000); // Remove after 3 seconds

                timers.push(timer);
            }
        });

        // Cleanup timers on unmount or when uploadProgress changes
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [uploadProgress, dispatch]);

    // Only show non-completed and non-aborted files (keep paused, waiting, uploading, hashing)
    const visibleProgress = uploadProgress.filter(progress =>
        progress.status === 'waiting' ||
        progress.status === 'hashing' ||
        progress.status === 'uploading' ||
        progress.status === 'paused'
        // 'completed' and 'aborted' are hidden (they will be cleaned after 3 seconds)
    );

    if (visibleProgress.length === 0) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'uploading':
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            case 'paused':
                return <Pause className="w-4 h-4 text-yellow-500" />;
            case 'hashing':
                return <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />;
            default:
                return <File className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'uploading': return 'Uploading';
            case 'paused': return 'Paused';
            case 'waiting': return 'Waiting...';
            case 'hashing': return 'Checking...';
            default: return status;
        }
    };

    const getProgressPercentage = (progress: uploadingProgress) => {
        if (progress.totalSize === 0) return 0;
        return Math.round((progress.uploadedBytes / progress.totalSize) * 100);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 w-96">
            {/* Header with expand/collapse */}
            <div
                className="bg-white rounded-t-lg shadow-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        <span className="text-sm font-medium text-gray-700">
                            Uploading ({visibleProgress.length})
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    )}
                </div>

                {/* Collapsed summary */}
                {!isExpanded && (
                    <div className="mt-1 text-xs text-gray-500">
                        {visibleProgress.filter(p => p.status === 'uploading').length} active,{' '}
                        {visibleProgress.filter(p => p.status === 'paused').length} paused
                    </div>
                )}
            </div>

            {/* Expanded list - Scrollable */}
            {isExpanded && (
                <div className="bg-white rounded-b-lg shadow-lg border border-t-0 border-gray-200 max-h-96 overflow-y-auto">
                    {visibleProgress.map((progress) => {
                        const percentage = getProgressPercentage(progress);
                        const isPaused = progress.status === 'paused';
                        const isHashing = progress.status === 'hashing';

                        return (
                            <div
                                key={progress.tempFileID}
                                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {getStatusIcon(progress.status)}
                                        <span className="text-sm font-medium text-gray-700 truncate" title={progress.fileName}>
                                            {progress.fileName}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                        {getStatusText(progress.status)}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-full ${isPaused ? 'bg-yellow-400' :
                                                isHashing ? 'bg-purple-400' :
                                                    'bg-blue-500'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between text-xs text-gray-500 mb-3">
                                    <span>{percentage}%</span>
                                    <span>
                                        {formatBytes(progress.uploadedBytes)} / {formatBytes(progress.totalSize)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {isPaused ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resume(progress.tempFileID);
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                        >
                                            <Play className="w-3 h-3" />
                                            Resume
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (progress.status === 'uploading') {
                                                    pause(progress.tempFileID);
                                                }
                                            }}
                                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${progress.status === 'uploading'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={progress.status !== 'uploading'}
                                        >
                                            <Pause className="w-3 h-3" />
                                            Pause
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            cancel(progress.tempFileID);
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                    >
                                        <XCircle className="w-3 h-3" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProgressBar;