import { Setter } from "@/types/global";
import axios from "axios";

export async function pasteFile(baseUrl: string, clipboard: any, uploading: boolean, parentId: string|null, setUploading: Setter<boolean>) {
  if (!clipboard || uploading) return;

  try {
    setUploading(true);
    const name = clipboard.name;
    const parentID = parentId;
    const userID = clipboard.userID;
    let originalStoragePath;
    let type;
    let size;

    if (clipboard.kind === "file") {
      originalStoragePath = clipboard.originalStoragePath;
      type = clipboard.type;
      size = clipboard.size;
      const response = await axios.post(
        `${baseUrl}/user/pastefile`,
        { name, parentID, userID, originalStoragePath, type, size },
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
  } catch (error) {
    console.log("error while uploading", error);
  } finally {
    setUploading(false);
  }
};
