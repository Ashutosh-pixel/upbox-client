import { clearRenamedArray, rename } from "@/lib/redux/slice/renameArraySlice";
import { uploadManager } from "@/services/UploadManager";
import { UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";

export function skipDuplicateFile(dispatch: Dispatch<UnknownAction>, duplicateFile: rename) {
    const task = uploadManager.globalDuplicateMap.get(duplicateFile.tempID);

    if (!task) {
        return;
    }

    uploadManager.globalDuplicateMap.delete(duplicateFile.tempID);
    dispatch(clearRenamedArray(duplicateFile));
}