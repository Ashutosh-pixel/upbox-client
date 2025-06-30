'use client'
import {useState} from "react";
import axios from "axios";


const FileUpload = () => {

    const [file, setFile] = useState<File | null>(null);
    const [userID, setUserID] = useState<string>("681cbca24c31bfa9b698a961");

    async function upload() {
        if(!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userID', userID);
        console.log('formData', formData.get("userID"))
        const response = await axios.post('http://localhost:3001/user/uploadfile', formData)
        alert(response.data.message || response.data.error)
    }

    return (
        <div>
            <input type="file" onChange={(e) => {
                if(e.target.files?.[0]){
                    setFile(e.target.files[0]);}
            }}/>
            <button onClick={upload}>Upload</button>
        </div>
    )
}

export default FileUpload