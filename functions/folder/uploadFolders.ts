import { handleUploadFile } from "@/lib/fileUpload";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export async function handleUploadFolders(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, userID: string, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], setUploadId: Setter<string[]>, setFileName: Setter<string[]>, setUploading: Setter<boolean>, setDuplicateFilesResponse: Setter<any>, setFolderMap: Setter<any>) {
  try {
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    } else {
      console.log("select files");
      return;
    }

    // step1: create folders
    const output = await axios.post(
      "http://localhost:3001/folder/uploadfolder",
      { userID, parentID, folders: selectedFolders, fileMeta: selectedFiles },
    );
    const folderMap = output.data.folderMap;

    // step2: process new folders
    const files = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const folderDoc = folderMap[selectedFiles[i].parent];
      const filename = selectedFiles[i].name;
      const parentID = folderDoc._id;

      files.push(
        {
          filename,
          parentID
        }
      );
    }

    // step3: bulk files duplication checking
    const filesRes = await axios.post('http://localhost:3001/folder/folderupload/bulkfilescheck', { userID, files });
    const duplicateFiles = filesRes.data.output.duplicate;
    setDuplicateFilesResponse(duplicateFiles);
    setFolderMap(folderMap)

    if (duplicateFiles.length > 0) {
      return;
    }

    // step4: files uploading
    for (let i = 0; i < selectedFiles.length; i++) {
      const folderDoc = folderMap[selectedFiles[i].parent];
      const storagePath = `${folderDoc.storagePath}${uuidv4()}-${selectedFiles[i].name}`;
      const pathIds = [...folderDoc.pathIds, folderDoc._id];
      const pathNames = folderDoc.pathNames;
      const folderID = folderDoc._id;

      await handleUploadFile(
        selectedFiles[i].file,
        selectedFiles[i].name,
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
  } catch (err: any) {
    console.log("folder upload failed", err);
    if (err.response?.status === 409) {
      if (err.response?.data?.errorCode === "DUPLICATE_FILE") {
        console.log('duplicate');
        // if (setErrorMessage) {
        //   setErrorMessage(err.response?.data?.message);
        // }
      }
    }
  }
}
