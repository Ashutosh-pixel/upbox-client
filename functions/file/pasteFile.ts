import { Setter } from "@/types/global";
import axios from "axios";

export async function pasteFile(baseUrl: string, clipboard: any, uploading: boolean, parentId: string | null, setUploading: Setter<boolean>) {
  if (!clipboard || uploading) return;

  try {
    setUploading(true);
    const name = clipboard.name;
    const parentID = parentId;
    const userID = clipboard.userID;
    const id = clipboard.id;
    let originalStoragePath;
    let type;
    let size;

    if (clipboard.kind === "file") {
      originalStoragePath = clipboard.originalStoragePath;
      type = clipboard.type;
      size = clipboard.size;
      const response = await axios.post(
        `${baseUrl}/user/pastefile`,
        { fileID: id, parentID, userID },
      );
      alert(response.data.message || response.data.error);
    } else if (clipboard.kind === "folder") {
      const id = clipboard.id;
      const parentID = parentId;
      const response = await axios.post(
        `${baseUrl}/folder/pastefolder`,
        { id, name, parentID, userID },
      );
      alert(response.data.message || response.data.error);
    }
  } catch (error: any) {
    console.log("error while uploading", error);
    if (error.response?.status === 409) {
      if (error.response?.data?.errorCode === "DUPLICATE_FILE") {
        console.log('duplicate');
        alert("File Already Exists in the Folder")
      }
    }
  } finally {
    setUploading(false);
  }
};
