'use client'
import FileUpload from '@/components/fileupload/FileUpload';
import FolderContainer from '@/components/folder/FolderContainer';
import FolderCreate from '@/components/folder/FolderCreate';
import FolderUpload from '@/components/folder/FolderUpload';
import Image from '@/components/sidebar/Image'
import { useParams } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import axios from "axios";

const page = () => {
    const [uploading, setUploading] = useState<boolean>(false);

    const params = useParams();
    const folderPath = Array.isArray(params.folder) ? params.folder : []

    const userID = "681cbca24c31bfa9b698a961";
    const parentId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

    const clipboard: any = useSelector((state: RootState) => state.clipboard);

    const pasteFile = async () => {
        if(!clipboard || uploading) return;

        try {
            setUploading(true);
            const name = clipboard.name;
            const parentID = parentId;
            const userID = clipboard.userID;
            let originalStoragePath;
            let type;
            let size;
            if(clipboard.kind === 'file'){
                originalStoragePath = clipboard.originalStoragePath;
                type = clipboard.type;
                size = clipboard.size;
            }

            if(clipboard.kind === 'file'){
                const response = await axios.post('http://localhost:3001/user/pastefile', {name,parentID,userID,originalStoragePath,type,size});
                alert(response.data.message || response.data.error)
            }

            else if(clipboard.kind === 'folder'){
                const id = clipboard.id;
                const parentID = parentId;
                const response = await axios.post('http://localhost:3001/folder/pastefolder', {id,name,parentID,userID});
                alert(response.data.message || response.data.error)
            }

        } catch (error) {
            console.log('error while uploading', error);
        }
        finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <FolderCreate parentID={parentId} />
            <FileUpload parentID={parentId} />
            <div><button className="cursor-pointer" onClick={pasteFile}>Paste</button></div>
            <FolderUpload parentID={parentId} userID={userID}/>
            <FolderContainer key={parentId} parentID={parentId} userID={userID} />
            <Image key={`img-${parentId}`} userID={userID} parentID={parentId} />
        </div>
    )
}

export default page;