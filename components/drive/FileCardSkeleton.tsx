// Shimmer UI component
import React from 'react';

const FileCardSkeleton: React.FC = () => {
    return (
        <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 shimmer">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-300/50 animate-pulse" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-1/2" />
                </div>

                {/* Metadata Skeletons */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileCardSkeleton;