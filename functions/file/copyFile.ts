import { reduxClipboardFileInfo, setClipboard } from "@/lib/redux/slice/clipboardSlice";
import { fileMetaData } from "@/types/response";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export function copyFile(fileMetadata: fileMetaData, dispatch: Dispatch<UnknownAction>) {
  const copyFileMetadata: reduxClipboardFileInfo = {
    id: fileMetadata._id,
    name: fileMetadata.filename,
    userID: fileMetadata.userID,
    type: fileMetadata.type,
    size: fileMetadata.size,
    parentID: fileMetadata.parentID,
    kind: "file",
    originalStoragePath: fileMetadata.storagePath,
  };
  dispatch(setClipboard(copyFileMetadata));
}