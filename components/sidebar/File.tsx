import { fileMetaData } from "@/types/response";
import React, { useEffect, useState } from "react";
import FileCard from "../file/FileCard";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface fileProp {
  userID: string;
  parentID: string | null;
  fileResponse: fileMetaData[];
}

const FileContainer: React.FC<fileProp> = ({ userID, parentID, fileResponse }) => {
  const [files, setFiles] = useState<fileMetaData[]>([]);
  const [fileLoading, setFileLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/files?parentID=${parentID}&userID=${userID}`);
        console.log('response', response);
        setFiles(response.data.output);
      } catch (error) {
        console.log('error fetching filemetadata', error)
      }
      finally {
        setFileLoading(false);
      }
    }

    if (userID) fetchFiles();
  }, [parentID])

    useEffect(() => {
        if(fileResponse[0]?._id && fileResponse[0]?.parentID === parentID){
            files.map((file) => {
                if(fileResponse[0]?._id === file._id){
                    return;
                }
            })
            setFiles((prev) => [...prev, fileResponse[0]]);
        }
    }, [fileResponse])

  useEffect(() => {
    console.log('fileResponse', fileResponse);
  }, [fileResponse])

  return (
    <div className="flex flex-wrap">
      {fileLoading && <div>Loading...</div>}
      {files &&
        files.length > 0 &&
        files?.map((fileMetadata) => {
          return <FileCard key={fileMetadata._id} fileMetadata={fileMetadata} />;
        })}
    </div>
  );
};

export default FileContainer;