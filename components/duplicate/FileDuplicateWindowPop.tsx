import { fileUpload } from '@/functions/file/fileUpload';
import { RenameDuplicateFile } from '@/functions/file/renameDuplicateFile';
import { RootState } from '@/lib/redux/store';
import { afterRename, Setter } from '@/types/global';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

interface duplicateProp {
    userID: string;
    parentID: string | null;
    file: File | null;
    isDuplicate: boolean;
    setIsDuplicate: Setter<boolean>;
    setUploading: Setter<boolean>;
    setProgress: Setter<number>
}

const FileDuplicateWindowPop: React.FC<duplicateProp> = ({ userID, parentID, file, isDuplicate, setIsDuplicate, setUploading, setProgress }) => {

    const [afterRenameArray, setAfterRenameArray] = useState<afterRename[]>([]);
    const clipboard: any = useSelector((state: RootState) => state.fileUploadProgress);
    const dispatch = useDispatch();

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        const fileupload = async () => {
            if (afterRenameArray.length > 0) {
                afterRenameArray.map(async (item: afterRename) => {
                    await fileUpload(API_BASE_URL, item.file, item.fileName, item.userID, item.parentID, item.uploadId, item.storagePath, item.fileID, dispatch, setUploading, setProgress);
                })

                setIsDuplicate(false);
            }
        }

        fileupload();
    }, [afterRenameArray])

    return (
        isDuplicate && <div>
            <div>{file?.name}</div>
            <button onClick={() => RenameDuplicateFile(file, userID, parentID, setAfterRenameArray)}>Rename</ button>
            <button onClick={() => setIsDuplicate(false)}>Skip</button>
        </div>
    )
}

export default FileDuplicateWindowPop