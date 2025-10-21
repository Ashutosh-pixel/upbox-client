import { selectedFiles, selectedFolders } from "@/types/folder";
import React, {useEffect, useRef, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { handleUploadFile } from "@/lib/fileUpload";

type SelectedFolderProps = {
    parentID: string | null,
    userID: string
}

const FolderUpload: React.FC<SelectedFolderProps> = ({parentID, userID}) => {

    const [selectedFiles, setSelectedFiles] = useState<selectedFiles[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<selectedFolders[]>([]);
    const [uploadId, setUploadId] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function processFileUpload(event:any){
        const filelist = event.target.files;
        const newPath = new Set<string>();

        // extract and arrange selected files
        const selectedFile = [];
        for(let i = 0; i < filelist.length; i++){
            const newFile: selectedFiles = {
                name: filelist[i].name,
                path: filelist[i].webkitRelativePath,
                parent: filelist[i].webkitRelativePath.substring(0, filelist[i].webkitRelativePath.lastIndexOf('/')) +'/',
                size: filelist[i].size,
                type: filelist[i].type,
                file: filelist[i]
            }
            const path = filelist[i].webkitRelativePath;
            newPath.add(path.substring(0, path. lastIndexOf('/')));
            selectedFile.push(newFile);
        }

        // extract and arrange selected folders
        const selectedFolder = [];
        for (const folderPath of newPath) {
            const newFolder: selectedFolders = {
                name: folderPath.substring(folderPath.lastIndexOf('/')+1),
                parent: folderPath.substring(0, folderPath.lastIndexOf('/'))+'/',
                path: folderPath + '/'
            }
            selectedFolder.push(newFolder);
        }
        if(selectedFolder.length > 0){
            selectedFolder[0].parent = parentID;
        }
        setSelectedFiles(selectedFile);
        setSelectedFolders(selectedFolder);
    }

    async function handleUploadFolders() {
        try {
            if(fileInputRef.current?.value){
                fileInputRef.current.value = "";
            }
            else{
                console.log("select files")
                return;
            }

            const output = await axios.post("http://localhost:3001/folder/uploadfolder", {userID, parentID, folders: selectedFolders, fileMeta: selectedFiles});
            const folderMap = output.data.folderMap;

            for (let i=0; i< selectedFiles.length; i++){
                const folderDoc = folderMap[selectedFiles[i].parent];
                const storagePath = `${folderDoc.storagePath}${uuidv4()}-${selectedFiles[i].name}`;
                const pathIds = [...folderDoc.pathIds, folderDoc._id];
                const pathNames = folderDoc.pathNames;
                const folderID = folderDoc._id;

                await handleUploadFile(selectedFiles[i].file, folderID, userID, folderID, pathIds, pathNames, storagePath, setUploadId, setUploading, setFileName);
            }

        }
        catch (error){
            console.log('folder upload failed', error);
        }
    }

    useEffect(() => {
        console.log(selectedFiles, selectedFolders);
    }, [selectedFiles, selectedFolders])

    return <div>
        <input type="file" webkitdirectory="true" onChange={processFileUpload} ref={fileInputRef}/>
        <button onClick={handleUploadFolders}>Upload Folder</button>
    </div>
}

export default FolderUpload
