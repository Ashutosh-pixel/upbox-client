'use client'
import axios from 'axios';
import React, { useState } from 'react'

type folderCreateProps = {
    parentID: string | null
}

const FolderCreate: React.FC<folderCreateProps> = ({ parentID }) => {

    const [name, setName] = useState<string>('');
    const userID = "68172b1df87d1cb0c096e49f";

    async function folderHandler() {
        const output = await axios.post('http://localhost:3001/folder/createfolder', { name, parentID, userID, folderPath: name })
        console.log('status', output.data.message);
    }


    return (
        <div>
            <input type="text" onChange={(e) => setName(e.target.value)} />
            <button onClick={() => folderHandler()}>Submit</button>
        </div>
    )
}

export default FolderCreate