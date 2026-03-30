import { createChunks } from "@/lib/utils";
import { Setter } from "@/types/global";
import UploadTask from "@/services/UploadTask"
import { uploadManager } from "@/services/UploadManager";
import { setUploadProgress, uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { v4 as uuidv4 } from 'uuid';
import { store } from "@/lib/redux/store";

export async function upload(baseUrl: string, file: File | null, file_Name: string, userID: string, parentID: string | null, setUploading: Setter<boolean>, setFileID: Setter<string>, setUploadId: Setter<string>, setFileName: Setter<string>, setIsDuplicate: Setter<boolean>) {
  if (!file) return;

  let index = 0;
  const tempFileID = uuidv4();
  let uploadTask = new UploadTask(index, baseUrl, file, file_Name, userID, parentID, tempFileID);

  const payload: uploadingProgress = {
    fileID: tempFileID,
    fileName: file_Name,
    uploadedBytes: 0,
    totalSize: file.size,
    status: "waiting",
    tempFileID: tempFileID
  }

  store.dispatch(setUploadProgress(payload))


  uploadManager.queue.addTask(uploadTask)
}
