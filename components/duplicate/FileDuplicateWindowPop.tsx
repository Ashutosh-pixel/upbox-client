'use client'
import { RenameDuplicateFile } from '@/functions/file/renameDuplicateFile';
import { skipDuplicateFile } from '@/functions/file/skipFile';
import { rename } from '@/lib/redux/slice/renameArraySlice';
import React from 'react'
import { useDispatch } from 'react-redux';
import { X, FileWarning, RotateCcw, SkipForward } from 'lucide-react';

interface duplicateProp {
    renameArray: rename[];
}

const FileDuplicateWindowPop: React.FC<duplicateProp> = ({ renameArray }) => {
    const dispatch = useDispatch();

    if (!renameArray || renameArray.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-[500px] max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <FileWarning className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-medium text-gray-800">Duplicate Files Found</h3>
                    </div>
                    <button
                        onClick={() => {
                            // Close all modals by clearing rename array
                            renameArray.forEach(file => skipDuplicateFile(dispatch, file));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <p className="text-sm text-gray-600 mb-3">
                        These files already exist. Choose what to do:
                    </p>
                    <div className="space-y-2">
                        {renameArray.map((duplicateFile) => (
                            <div key={duplicateFile.tempID} className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-800 break-all mb-2">
                                    {duplicateFile.filename}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => RenameDuplicateFile(duplicateFile, dispatch)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => skipDuplicateFile(dispatch, duplicateFile)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors"
                                    >
                                        <SkipForward className="w-3.5 h-3.5" />
                                        Skip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FileDuplicateWindowPop