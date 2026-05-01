'use client'
import { folderHandler } from '@/functions/folder/folderCreate';
import React, { useState } from 'react'
import { FolderPlus, X, AlertCircle } from 'lucide-react'

type folderCreateProps = {
    parentID: string | null
}

const FolderCreate: React.FC<folderCreateProps> = ({ parentID }) => {
    const [name, setName] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Folder name cannot be empty');
            return;
        }

        setError('');
        setIsLoading(true);

        const result = await folderHandler(name, parentID);

        setIsLoading(false);

        if (result?.success) {
            // Success - close modal and reset
            setName('');
            setIsOpen(false);
            setError('');
        } else if (result?.error) {
            // Show error message
            setError(result.error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setName('');
        setError('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
        }
    };

    return (
        <>
            {/* Create Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300"
            >
                <FolderPlus className="w-4 h-4" />
                <span className="text-sm font-medium">New Folder</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-6 transform transition-all duration-200 scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Create New Folder</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Folder Name
                            </label>
                            <input
                                type="text"
                                autoFocus
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error) setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter folder name..."
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${error ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            />

                            {/* Error Message */}
                            {error && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!name.trim() || isLoading}
                                className={`flex-1 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${!name.trim() || isLoading
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    'Create Folder'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FolderCreate