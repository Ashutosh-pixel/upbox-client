// fetchFolderFiles.ts (Updated to handle null properly)
import { api } from "@/lib/api";
import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";

export async function fetchFiles(
  parentID: string | null,
  setFiles: Setter<fileMetaData[]>,
  setFileLoading: Setter<boolean>,
  setCursor: Setter<string | null>,
  currentCursor: string | null,
  limit: number,
  fileType: string
) {
  try {
    const parentIDParam = parentID === null ? 'null' : parentID;
    // Only include cursor if it exists and is not null
    const cursorParam = currentCursor ? `&cursor=${currentCursor}` : '';
    const url = `/user/files?parentID=${parentIDParam}&limit=${limit}&type=${fileType}${cursorParam}`;

    const response = await api.get(url);

    setFiles(prev => [...prev, ...response.data.output]);
    setCursor(response.data.nextCoursor);

    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}