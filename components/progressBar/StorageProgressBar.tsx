'use client';

interface StorageCardProps {
    used: number;
    total: number;
}

export default function StorageCard({ used, total }: StorageCardProps) {
    const percentage = (used / total) * 100;
    const free = total - used;

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const getColor = () => {
        if (percentage >= 90) return "bg-red-500";
        if (percentage >= 70) return "bg-orange-500";
        return "bg-blue-500";
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-500 text-xs font-medium">Storage</h3>
                <span className="text-xs font-medium text-gray-600">{percentage.toFixed(0)}%</span>
            </div>

            <p className="text-sm font-bold text-gray-800 mb-2">
                {formatSize(used)} <span className="text-xs text-gray-400">/ {formatSize(total)}</span>
            </p>

            <div className="mb-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between text-xs">
                <span className="text-gray-400">Used {formatSize(used)}</span>
                <span className="text-gray-400">Free {formatSize(free)}</span>
            </div>
        </div>
    );
}