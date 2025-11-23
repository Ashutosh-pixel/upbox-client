import {reduxClipboardFileInfo, setClipboard} from '@/lib/redux/slice/clipboardSlice';
import { dateFormat } from '@/lib/utils'
import { fileMetaData } from '@/types/response'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useDispatch} from "react-redux";

interface filemetadataProp {
    fileMetadata: fileMetaData
}


const FileCard: React.FC<filemetadataProp> = ({ fileMetadata }) => {

    const [fileURL, setFileURL] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        const getFileURL = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/user/file/${fileMetadata._id}`);
                const url = await res.data.url;
                setFileURL(url);
            } catch (error) {
                console.log('failed to get fileURL', error);
            }
        }
        if (fileMetadata?._id) getFileURL();
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

    const copyFile = () => {
        const copyFileMetadata: reduxClipboardFileInfo = {
            id: fileMetadata._id,
            name: fileMetadata.filename,
            userID: fileMetadata.userID,
            type: fileMetadata.type,
            size: fileMetadata.size,
            parentID: fileMetadata.parentID,
            kind: 'file',
            originalStoragePath: fileMetadata.storagePath
        }
        dispatch(setClipboard(copyFileMetadata));
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
                <button onClick={() => copyFile()}>copy</button>
            </div>
        </div>
    )
}

export default FileCard