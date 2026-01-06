import { fileUpload } from '@/functions/file/fileUpload';
import { RenameDuplicateFiles } from '@/functions/file/renameDuplicateFiles';
import { selectedFiles } from '@/types/folder';
import { afterRename, Setter } from '@/types/global';
import React, { useEffect, useState } from 'react'

interface duplicateProp {
    userID: string;
    duplicateFilesResponse: any;
    folderMap: any;
    selectedFiles: selectedFiles[];
    setDuplicateFilesResponse: Setter<any>;
}

interface duplicate {
    file: File | null;
    name: string;
    path: string;
}


const FilesDuplicateWindowPop: React.FC<duplicateProp> = ({ userID, duplicateFilesResponse, folderMap, selectedFiles, setDuplicateFilesResponse }) => {

    const [duplicateFiles, setDuplicateFiles] = useState<duplicate[]>([]);
    const [afterRenameArray, setAfterRenameArray] = useState<afterRename[]>([]);

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    useEffect(() => {
        console.log('afterRenameArray', afterRenameArray);
    }, [afterRenameArray])

    useEffect(() => {
        if (duplicateFilesResponse && selectedFiles && selectedFiles.length > 0 && duplicateFilesResponse.length > 0) {

            const files: duplicate[] = [];

            selectedFiles.map((f: selectedFiles) => {
                duplicateFilesResponse.map((d: string) => {
                    if (d === f.path) {
                        files.push({ name: f.name, path: f.path, file: f.file });
                    }
                })
            })

            setDuplicateFiles(files);
        }
    }, [])

    useEffect(() => {
        const fileupload = async () => {
            if (duplicateFilesResponse.length === afterRenameArray.length && afterRenameArray.length > 0) {

                afterRenameArray.map(async (item: afterRename, index) => {
                    await fileUpload(API_BASE_URL, item.file, item.fileName, item.userID, item.parentID, item.uploadId, item.storagePath, item.fileID);
                })

                setDuplicateFiles([]);
                setDuplicateFilesResponse([]);

            }
        }

        fileupload();
    }, [afterRenameArray])

    return (
        duplicateFiles.map((item, index: number) => {

            return <div key={index}>
                <div>{item.name}</div>
                <button onClick={() => RenameDuplicateFiles(item.file, userID, item.path, folderMap, selectedFiles, setAfterRenameArray)}>Rename</ button>
                <button>Skip</button>
            </div>
        })
    )
}

export default FilesDuplicateWindowPop