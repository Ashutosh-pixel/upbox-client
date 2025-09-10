'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/redux/store";
import {setClipboard} from "@/lib/redux/slice/clipboardSlice";

type FolderProps = {
    parentID: string | null,
    userID: string
}
const FolderContainer: React.FC<FolderProps> = ({ userID, parentID }) => {

    const [folders, setFolders] = useState<folder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const dispatch = useDispatch<AppDispatch>();

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

// {
//     "_id": "68ab0f6656e2a73db64d44cc",
//     "name": "New folder (2)",
//     "parentID": "68ab0f6456e2a73db64d44c3",
//     "userID": "681cbca24c31bfa9b698a961",
//     "storagePath": "user-681cbca24c31bfa9b698a961/uploads/test/New folder (2)/",
//     "pathIds": [
//     null,
//     "68ab0f6456e2a73db64d44c3"
// ],
//     "pathNames": [
//     "test",
//     "New folder (2)"
// ],
//     "uploadTime": "2025-08-24T13:11:02.177Z",
//     "createdAt": "2025-08-24T13:11:02.177Z",
//     "updatedAt": "2025-08-24T13:11:02.177Z",
//     "__v": 0
// }