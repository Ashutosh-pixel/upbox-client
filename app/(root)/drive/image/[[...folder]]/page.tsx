'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import Image from '@/components/sidebar/Image'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const params = useParams();
    const folderPath = params.folder ? (Array.isArray(params.folder) ? params.folder : [params.folder]) : [];

    const userID = "68172b1df87d1cb0c096e49f";
    const parentID = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

    useEffect(() => {
        console.log('params', parentID)
    }, [parentID])

    return (
        <div>
            <FolderCreate parentID={parentID} />
            <FileUpload parentID={parentID} />
            <FolderContainer parentID={parentID} userID={userID} />
            <Image userID={userID} parentID={parentID} />
        </div>
    )
}

export default page;