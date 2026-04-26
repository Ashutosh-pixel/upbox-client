import { api } from "@/lib/api";
import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";
import axios from "axios";

export async function fetchFiles(parentID: string | null, setFiles: Setter<fileMetaData[]>, setFileLoading: Setter<boolean>, setCursor: Setter<string | null>, cursor: string | null, limit: number) {
  try {
    const url = `/user/files?parentID=${parentID}&cursor=${cursor}&limit=${limit}`;
    console.log("url", url, "cursor", cursor);

    const response = await api.get(url);
    setFiles((prev) => [...prev, ...response.data.output]);
    setCursor(response.data.nextCoursor);
  } catch (error) {
    console.log("error fetching filemetadata", error);
    setCursor(null);
  } finally {
    setFileLoading(false);
  }
}
