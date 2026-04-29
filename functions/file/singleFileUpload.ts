import { createChunks } from "@/lib/utils";
import { Setter } from "@/types/global";
import UploadTask from "@/services/UploadTask"
import { uploadManager } from "@/services/UploadManager";
import { setUploadProgress, uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { v4 as uuidv4 } from 'uuid';
import { store } from "@/lib/redux/store";
import { uploadDuplicateCheck } from "@/services/UploadDuplicateCheck";
import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";

export async function upload(baseUrl: string, file: File | null, file_Name: string, parentID: string | null, setSpaceExceed: React.Dispatch<React.SetStateAction<boolean>>, dispatch: Dispatch<UnknownAction>) {
  if (!file) return;


  let index = 0;
  const tempFileID = uuidv4();
  let uploadTask = new UploadTask(index, baseUrl, file, file_Name, parentID, tempFileID, setSpaceExceed, dispatch);

  // check duplicate WITH task
  const isDuplicate = await uploadDuplicateCheck(
    file,
    parentID,
    uploadTask,   // ✅ pass task
    dispatch
  );

  if (!isDuplicate) {
    // ✅ directly upload
    const payload: uploadingProgress = {
      fileID: tempFileID,
      fileName: file_Name,
      uploadedBytes: 0,
      totalSize: file.size,
      status: "waiting",
      tempFileID
    };

    store.dispatch(setUploadProgress(payload));

    uploadManager.queue.addTask(uploadTask);
  }
}
