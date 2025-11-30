import { copyFile } from '@/functions/file/copyFile';
import { getFileURL } from '@/functions/file/fetchFileURL';
import { dateFormat } from '@/lib/utils'
import { fileMetaData } from '@/types/response'
import React, { useEffect, useState } from 'react'
import {useDispatch} from "react-redux";

interface filemetadataProp {
    fileMetadata: fileMetaData
}


const FileCard: React.FC<filemetadataProp> = ({ fileMetadata }) => {

    const [fileURL, setFileURL] = useState<string>("");
    const dispatch = useDispatch();
    const url: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
      if (fileMetadata?._id) getFileURL(url, fileMetadata, setFileURL);
    }, [fileMetadata]);


    function renderFile(fileType: string) {
        if (!fileType || !fileURL) {
            return <span className='text-sm text-gray-500'>No preview available</span>
        }

        if (fileType.startsWith('image/')) {
            return <img src={fileURL} alt={fileMetadata.filename} className='rounded-xl object-contain' />
        }

        if (fileType.startsWith('video/')) {
            return <video controls src={fileURL} className='rounded-xl bg-black object-contain' />
        }
    }

    function renderName(fileType: string) {
        if (!fileType) {
            return "No Name"
        }

        if (fileType.startsWith('image/')) {
            return "Gallery"
        }

        if (fileType.startsWith('video/')) {
            return "Video"
        }
    }

    return (
        <div className='p-4 bg-white rounded-xl'>
            <div className='relative w-96 h-64 overflow-hidden rounded-xl'>
                {renderFile(fileMetadata.type)}
            </div>
            <div className='mt-2'>
                <div>Created on {dateFormat(fileMetadata.uploadTime)}</div>
                <div className='break-words whitespace-normal'>{renderName(fileMetadata.type)}-{fileMetadata.filename}</div>
            </div>
            <div className='mt-2'>You opened {dateFormat(fileMetadata.updatedAt)}</div>
            <div>
                <button onClick={() => copyFile(fileMetadata, dispatch)}>copy</button>
            </div>
        </div>
    )
}

export default FileCard