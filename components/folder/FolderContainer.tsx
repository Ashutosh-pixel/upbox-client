'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';
import { folder } from '@/types/response';

type FolderProps = {
    parentID: string | null,
    userID: string
}
const FolderContainer: React.FC<FolderProps> = ({ userID, parentID }) => {

    const [folders, setFolders] = useState<folder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

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

    return (
        <div>
            {loading ? <div>Loading Folders...</div> : folders?.map((item: any, index: number) => {
                return <div key={index} onClick={() => !parentID ? router.push(`image/${item._id}`) : router.push(`${item._id}`)}>
                    <p>{item.name}</p>
                </div>
            })}
        </div>
    )
}

export default FolderContainer;