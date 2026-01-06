import { upload } from '@/functions/file/singleFileUpload';
import { Setter } from '@/types/global'
import React, { useState } from 'react'

interface DuplicateProps {
    API_BASE_URL: string;
    file: File | null;
    userID: string;
    parentID: string | null;
    setUploading: Setter<boolean>;
    setFileID: Setter<string>;
    setUploadId: Setter<string>;
    setFileName: Setter<string>;
    setIsDuplicate: Setter<boolean>;
}

const DuplicatePopup: React.FC<DuplicateProps> = ({ API_BASE_URL, file, userID, parentID, setUploading, setFileID, setUploadId, setFileName, setIsDuplicate }) => {

    const [newName, setNewName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newName.trim()) {
            setErrorMessage("Filename required");
            return;
        }
        upload(API_BASE_URL, file, newName, userID, parentID, setUploading, setFileID, setUploadId, setFileName, setIsDuplicate, setErrorMessage);
    }

    const resetForm = () => {
        setErrorMessage('');
        setIsDuplicate(false);
        setNewName('');
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" value={newName} onChange={(e) => {
                    setErrorMessage('');
                    setNewName(e.target.value);
                }} />
                <div>{errorMessage && errorMessage}</div>
                <div><button type='submit'>yes</button></div>
                <div><button onClick={resetForm}>no</button></div>
            </form>
        </div>
    )
}

export default DuplicatePopup