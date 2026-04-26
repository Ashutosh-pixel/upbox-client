import { UploadFolderProcess } from "@/services/UploadFolderProcess";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import { UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "react";
import { v4 as uuidv4 } from 'uuid';

export async function handleUploadFolders(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], setUploadId: Setter<string[]>, setFileName: Setter<string[]>, setUploading: Setter<boolean>, setDuplicateFilesResponse: Setter<any>, setFolderMap: Setter<any>, dispatch: Dispatch<UnknownAction>) {

  new UploadFolderProcess(baseUrl, fileInputRef, parentID, selectedFiles, selectedFolders, dispatch);
}
