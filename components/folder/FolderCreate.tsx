'use client'
import { folderHandler } from '@/functions/folder/folderCreate';
import React, { useState } from 'react'

type folderCreateProps = {
    parentID: string | null
}

const FolderCreate: React.FC<folderCreateProps> = ({ parentID }) => {

    const [name, setName] = useState<string>('');

    return (
        <div>
            <input type="text" onChange={(e) => setName((e.target.value).trim())} />
            <button onClick={() => folderHandler(name, parentID)}>Submit</button>
        </div>
    )
}

export default FolderCreate