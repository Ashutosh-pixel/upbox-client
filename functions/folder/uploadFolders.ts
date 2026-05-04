import { UploadFolderProcess } from "@/services/UploadFolderProcess";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";

export async function handleUploadFolders(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], setSpaceExceed: React.Dispatch<React.SetStateAction<boolean>>, dispatch: Dispatch<UnknownAction>) {

  new UploadFolderProcess(baseUrl, fileInputRef, parentID, selectedFiles, selectedFolders, setSpaceExceed, dispatch);
}
