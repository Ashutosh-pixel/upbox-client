import { selectedFiles, selectedFolders } from "@/types/folder";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

type SelectedFolderProps = {
    parentID: string | null,
    userID: string
}

const FolderUpload: React.FC<SelectedFolderProps> = ({parentID, userID}) => {

    const [selectedFiles, setSelectedFiles] = useState<selectedFiles[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<selectedFolders[]>([]);
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
            let path = filelist[i].webkitRelativePath;
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

    async function handleUpload() {
        try {
            if(fileInputRef.current?.value){
                fileInputRef.current.value = "";
            }
            else{
                console.log("select files")
                return;
            }
            const formData = new FormData();
            formData.append('userID', userID);
            formData.append('parentID', JSON.stringify(parentID));
            formData.append('folders', JSON.stringify(selectedFolders));
            formData.append('fileMeta', JSON.stringify(selectedFiles));

            for (let i=0; i < selectedFiles.length; i++){
                formData.append('files', selectedFiles[i].file);
            }

            const output = await axios.post("http://localhost:3001/folder/uploadfolder", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log('folder uploaded success');
            alert(output.data.message)

        }
        catch (error){
            console.log('folder upload failed');
        }
    }

    useEffect(() => {
        console.log(selectedFiles, selectedFolders);
    }, [selectedFiles, selectedFolders])

    return <div>
        <input type="file" webkitdirectory="true" onChange={processFileUpload} ref={fileInputRef}/>
        <button onClick={handleUpload}>Upload Folder</button>
    </div>
}

export default FolderUpload