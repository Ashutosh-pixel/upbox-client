'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import FolderUpload from '@/components/folder/FolderUpload';
import Image from '@/components/sidebar/Image'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const params = useParams();
    const folderPath = Array.isArray(params.folder) ? params.folder : []

    const userID = "681cbca24c31bfa9b698a961";
    const parentID = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

    useEffect(() => {
        console.log('params', parentID)
    }, [parentID])

    return (
        <div>
            <FolderCreate parentID={parentID} />
            <FileUpload parentID={parentID} />
            <FolderUpload parentID={parentID} userID={userID}/>
            <FolderContainer key={parentID} parentID={parentID} userID={userID} />
            <Image key={`img-${parentID}`} userID={userID} parentID={parentID} />
        </div>
    )
}

export default page;