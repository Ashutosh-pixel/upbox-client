import { handleUploadFile } from "@/lib/fileUpload";
import { UploadFolderProcess } from "@/services/UploadFolderProcess";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export async function handleUploadFolders(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, userID: string, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], setUploadId: Setter<string[]>, setFileName: Setter<string[]>, setUploading: Setter<boolean>, setDuplicateFilesResponse: Setter<any>, setFolderMap: Setter<any>) {

  new UploadFolderProcess(baseUrl, fileInputRef, userID, parentID, selectedFiles, selectedFolders);
}
