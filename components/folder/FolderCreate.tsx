'use client'
import { folderHandler } from '@/functions/folder/folderCreate';
import React, { useState } from 'react'

type folderCreateProps = {
  parentID: string | null
}

const FolderCreate: React.FC<folderCreateProps> = ({ parentID }) => {

    const [name, setName] = useState<string>('');
    const userID = "681cbca24c31bfa9b698a961";
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    
    return (
        <div>
            <input type="text" onChange={(e) => setName((e.target.value).trim())} />
            <button onClick={() => folderHandler(API_BASE_URL, name, parentID, userID)}>Submit</button>
        </div>
    )
}

export default FolderCreate