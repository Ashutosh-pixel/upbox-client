import { handleUploadFile } from "@/lib/fileUpload";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export async function handleUploadFolders(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, userID: string, parentID: string|null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], setUploadId: Setter<string[]>, setFileName: Setter<string[]>, setUploading: Setter<boolean>) {
  try {
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    } else {
      console.log("select files");
      return;
    }

    const output = await axios.post(
      "http://localhost:3001/folder/uploadfolder",
      { userID, parentID, folders: selectedFolders, fileMeta: selectedFiles },
    );
    const folderMap = output.data.folderMap;

    for (let i = 0; i < selectedFiles.length; i++) {
      const folderDoc = folderMap[selectedFiles[i].parent];
      const storagePath = `${folderDoc.storagePath}${uuidv4()}-${selectedFiles[i].name}`;
      const pathIds = [...folderDoc.pathIds, folderDoc._id];
      const pathNames = folderDoc.pathNames;
      const folderID = folderDoc._id;

      await handleUploadFile(
        selectedFiles[i].file,
        folderID,
        userID,
        folderID,
        pathIds,
        pathNames,
        storagePath,
        setUploadId,
        setUploading,
        setFileName,
      );
    }
  } catch (error) {
    console.log("folder upload failed", error);
  }
}
