'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/redux/store";
import { fetchFolders } from '@/functions/folder/fetchFolders';
import { copyFolder } from './copyFolder';

type FolderProps = {
    parentID: string | null,
    userID: string,
    folderResponse: folder[]
}
const FolderContainer: React.FC<FolderProps> = ({ userID, parentID, folderResponse }) => {

    const [folders, setFolders] = useState<folder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();
    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    // const newFolders: any[] = useSelector((state: RootState) => state.sse.folders);

    useEffect(() => {
        if(userID) fetchFolders(API_BASE_URL, userID, parentID, setFolders, setLoading);
    }, [parentID, userID])

    useEffect(() => {
        if(folderResponse[0]?._id && folderResponse[0]?.parentID === parentID){
            folders.map((folder) => {
                if(folderResponse[0]?._id === folder._id){
                    return;
                }
            })
            setFolders((prev) => [...prev, folderResponse[0]]);
        }
    }, [folderResponse])

    useEffect(() => {
        console.log('folderResponse', folderResponse);
    }, [folderResponse])

    return (
        <div>
            {loading ? <div>Loading Folders...</div> : folders?.map((item: any, index: number) => {
                return <div key={index} >
                    <div key={index} onClick={() => !parentID ? router.push(`image/${item._id}`) : router.push(`${item._id}`)}>
                        <p>{item.name}</p>
                    </div>
                    <button onClick={() => copyFolder(item, dispatch)}>copy</button>
                </div>
            })}
        </div>
    )
}

export default FolderContainer;