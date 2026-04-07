import { setUploadProgress, uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { clearRenamedArray, rename } from "@/lib/redux/slice/renameArraySlice";
import { store } from "@/lib/redux/store";
import { uploadManager } from "@/services/UploadManager";
import UploadTask from "@/services/UploadTask";
import { afterRename, Setter } from "@/types/global";
import { UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "react";
import { v4 as uuidv4 } from 'uuid';

export async function RenameDuplicateFile(
    baseUrl: string,
    duplicateFile: rename,
    userID: string,
    dispatch: Dispatch<UnknownAction>
) {

    const task = uploadManager.globalDuplicateMap.get(duplicateFile.tempID);

    console.log('uploadManager.globalDuplicateMap', uploadManager.globalDuplicateMap)

    try {
        if (!task) return;

        const duplicateFileQuery = {
            filename: duplicateFile.filename,
            parentID: duplicateFile.parentID,
            userID,
            type: duplicateFile.type
        };

        const initRes = await axios.post(`${baseUrl}/user/file/rename`, duplicateFileQuery);

        const newName = initRes.data.newName;

        // ✅ update EXISTING task
        task.fileName = newName;

        const payload: uploadingProgress = {
            fileID: task.tempFileID,
            fileName: newName,
            uploadedBytes: 0,
            totalSize: task.file.size,
            status: "waiting",
            tempFileID: task.tempFileID
        };

        store.dispatch(setUploadProgress(payload));

        // ✅ now add to queue
        uploadManager.queue.addTask(task);

        // cleanup
        uploadManager.globalDuplicateMap.delete(duplicateFile.tempID);
        dispatch(clearRenamedArray(duplicateFile));

    } catch (error) {
        console.log('rename duplicate file error', error);
    }
}