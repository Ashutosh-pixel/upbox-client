import { fileMetaData } from "@/types/response";
import React, { useEffect, useState } from "react";
import FileCard from "../file/FileCard";
import { fetchFiles } from "@/functions/file/fetchFolderFiles";

interface fileProp {
  userID: string;
  parentID: string | null;
  fileResponse: fileMetaData[];
}

const FileContainer: React.FC<fileProp> = ({ userID, parentID, fileResponse }) => {
  const [files, setFiles] = useState<fileMetaData[]>([]);
  const [fileLoading, setFileLoading] = useState<boolean>(true);
  const url: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  useEffect(() => {
    if (userID) fetchFiles(url, parentID, userID, setFiles, setFileLoading);
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