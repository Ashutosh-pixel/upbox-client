import { api } from "@/lib/api";
import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";

export async function getFileURL(url: string, fileMetadata: fileMetaData, setFileURL: Setter<string>) {
  try {
    const res = await api.get(
      `${url}/user/file/${fileMetadata._id}`,
    );
    const fileUrl = await res.data.url;
    setFileURL(fileUrl);
  } catch (error) {
    console.log("failed to get fileURL", error);
  }
}
