import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";
import axios from "axios";

export async function fetchFiles(baseUrl: string, parentID: string | null, userID: string, setFiles: Setter<fileMetaData[]>, setFileLoading: Setter<boolean>, setCursor: Setter<string | null>, cursor: string | null, limit: number) {
  try {
    const url = `${baseUrl}/user/files?parentID=${parentID}&userID=${userID}&cursor=${cursor}&limit=${limit}`;
    console.log("url", url, "cursor", cursor);

    const response = await axios.get(url);
    setFiles((prev) => [...prev, ...response.data.output]);
    setCursor(response.data.nextCoursor);
  } catch (error) {
    console.log("error fetching filemetadata", error);
    setCursor(null);
  } finally {
    setFileLoading(false);
  }
}
