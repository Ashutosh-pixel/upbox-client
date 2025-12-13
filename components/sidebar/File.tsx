import { fileMetaData } from "@/types/response";
import React, { useEffect, useRef, useState } from "react";
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
  const [cursor, setCursor] = useState<string | null>('');
  const [limit, setLimit] = useState<number>(3);
  const loadRef = useRef(null);
  const url: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';


  useEffect(() => {
    if (fileResponse[0]?._id && fileResponse[0]?.parentID === parentID) {
      files.map((file) => {
        if (fileResponse[0]?._id === file._id) {
          return;
        }
      })
      setFiles((prev) => [fileResponse[0], ...prev]);
    }
  }, [fileResponse])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (userID && cursor !== null) fetchFiles(url, parentID, userID, setFiles, setFileLoading, setCursor, cursor, limit);
      }
    }, { threshold: 0.5 }
    );

    if (loadRef.current) observer.observe(loadRef.current);
    return () => observer.disconnect();
  }, [cursor])

  return (
    <div className="flex flex-wrap">
      {fileLoading && <div>Loading...</div>}
      {files &&
        files.length > 0 &&
        files?.map((fileMetadata) => {
          return <FileCard key={fileMetadata._id} fileMetadata={fileMetadata} />;
        })}
      <div ref={loadRef} />
    </div>
  );
};

export default FileContainer;
