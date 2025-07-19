'use client'
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const params = useParams();
    const userID = "68172b1df87d1cb0c096e49f"

    useEffect(() => {
        console.log('params', params.folder)
    }, [])

    return (
        <div>
            <FolderCreate parentID={!params.folder ? null : params.folder[params.folder?.length - 1]} />
            <FolderContainer parentID={!params.folder ? '' : params.folder[params.folder?.length - 1]} userID={userID} />
        </div>
    )
}

export default page;