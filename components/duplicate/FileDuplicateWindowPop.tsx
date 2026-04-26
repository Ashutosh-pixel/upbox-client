import { RenameDuplicateFile } from '@/functions/file/renameDuplicateFile';
import { skipDuplicateFile } from '@/functions/file/skipFile';
import { rename } from '@/lib/redux/slice/renameArraySlice';
import React from 'react'
import { useDispatch } from 'react-redux';

interface duplicateProp {
    renameArray: rename[];
}

const FileDuplicateWindowPop: React.FC<duplicateProp> = ({ renameArray }) => {

    const dispatch = useDispatch();


    return (
        <div>
            {renameArray.map((duplicateFile, index) => {
                return (
                    <div key={duplicateFile.tempID}>
                        <div>{duplicateFile.filename}</div>
                        <div className='flex gap-1'>
                            <button onClick={() => {
                                RenameDuplicateFile(duplicateFile, dispatch);
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