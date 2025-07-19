'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';

type FolderProps = {
    parentID: string | undefined,
    userID: string
}
const FolderContainer: React.FC<FolderProps> = ({ userID, parentID }) => {

    const [folders, setFolders] = useState<folder[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFolders = async () => {
            const output = await axios.get(`http://localhost:3001/folder/getallfolder?parentID=${parentID}&userID=${userID}`);
            setFolders(output.data.output);
        }
        fetchFolders();
    }, [])

    return (
        <div>
            {folders?.map((item: any, index: number) => {
                return <div key={index} onClick={() => !parentID ? router.push(`image/${item._id}`) : router.push(`${item._id}`)}>
                    <p>{item.name}</p>
                </div>
            })}
        </div>
    )
}

export default FolderContainer;