import { createChunks } from "@/lib/utils";
import { Setter } from "@/types/global";
import UploadTask from "@/services/UploadTask"
import { uploadManager } from "@/services/UploadManager";

export async function upload(baseUrl: string, file: File | null, file_Name: string, userID: string, parentID: string | null, setUploading: Setter<boolean>, setFileID: Setter<string>, setUploadId: Setter<string>, setFileName: Setter<string>, setIsDuplicate: Setter<boolean>) {
  if (!file) return;

  let index = 0;
  let uploadTask = new UploadTask(index, baseUrl, file, file_Name, userID, parentID);
  uploadManager.queue.addTask(uploadTask);
}
