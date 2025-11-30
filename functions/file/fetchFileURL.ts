import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";
import axios from "axios";

export async function getFileURL(url: string, fileMetadata: fileMetaData, setFileURL: Setter<string>) {
  try {
    const res = await axios.get(
      `${url}/user/file/${fileMetadata._id}`,
    );
    const fileUrl = await res.data.url;
    setFileURL(fileUrl);
  } catch (error) {
    console.log("failed to get fileURL", error);
  }
}
