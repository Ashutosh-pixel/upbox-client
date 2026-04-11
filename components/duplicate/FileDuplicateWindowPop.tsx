import { fileUpload } from '@/functions/file/fileUpload';
import { RenameDuplicateFile } from '@/functions/file/renameDuplicateFile';
import { skipDuplicateFile } from '@/functions/file/skipFile';
import { rename } from '@/lib/redux/slice/renameArraySlice';
import { RootState } from '@/lib/redux/store';
import { uploadManager } from '@/services/UploadManager';
import { afterRename, Setter } from '@/types/global';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

interface duplicateProp {
    renameArray: rename[];
    userID: string;
    baseUrl: string;
}

const FileDuplicateWindowPop: React.FC<duplicateProp> = ({ renameArray, userID, baseUrl }) => {

    const dispatch = useDispatch();

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    return (
        <div>
            {renameArray.map((duplicateFile, index) => {
                return (
                    <div key={duplicateFile.tempID}>
                        <div>{duplicateFile.filename}</div>
                        <div className='flex gap-1'>
                            <button onClick={() => {
                                RenameDuplicateFile(baseUrl, duplicateFile, userID, dispatch);
                                console.log('click')
                            }}>Rename</button>
                            <button onClick={() => skipDuplicateFile(dispatch, duplicateFile)}>Skip</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default FileDuplicateWindowPop