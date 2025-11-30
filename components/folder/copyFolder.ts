import { setClipboard } from "@/lib/redux/slice/clipboardSlice";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export function copyFolder(item: any, dispatch: Dispatch<UnknownAction>){
  console.log("copy", item);
  const folderMetadata = {
    id: item._id,
    name: item.name,
    userID: item.userID,
    parentID: item.parentID,
    kind: "folder",
  };
  dispatch(setClipboard(folderMetadata));
};
