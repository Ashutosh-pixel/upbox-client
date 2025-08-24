'use client'
import axios from 'axios';
import React, { useState } from 'react'

type folderCreateProps = {
    parentID: string | null
}

const FolderCreate: React.FC<folderCreateProps> = ({ parentID }) => {

    const [name, setName] = useState<string>('');
    const userID = "681cbca24c31bfa9b698a961";

    async function folderHandler() {
        try {
            const output = await axios.post('http://localhost:3001/folder/createfolder', { name, parentID, userID, folderPath: name })
            console.log('status', output.data.message);
            alert(output.data.message || output.data.error);
        }
        catch (error) {
            console.log('error is', error)
        }
    }


    return (
        <div>
            <input type="text" onChange={(e) => setName(e.target.value)} />
            <button onClick={() => folderHandler()}>Submit</button>
        </div>
    )
}

export default FolderCreate