'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/redux/store";
import {setClipboard} from "@/lib/redux/slice/clipboardSlice";

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
    // const newFolders: any[] = useSelector((state: RootState) => state.sse.folders);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                setLoading(true);
                const output = await axios.get(`http://localhost:3001/folder/getallfolder?parentID=${parentID}&userID=${userID}`);
                setFolders(output.data.output);
            } catch (error) {
                console.log('error fetching folders', error)
            }
            finally {
                setLoading(false);
            }
        }
        fetchFolders();
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

    const copyFolder = (item: any) => {
        console.log('copy', item);
//        console.log('folders', folders);
        const folderMetadata = {
            id: item._id,
            name: item.name,
            userID: item.userID,
            parentID: item.parentID,
            kind: 'folder',
        }
        dispatch(setClipboard(folderMetadata));
    }

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
                    <button onClick={() => copyFolder(item)}>copy</button>
                </div>
            })}
        </div>
    )
}

export default FolderContainer;