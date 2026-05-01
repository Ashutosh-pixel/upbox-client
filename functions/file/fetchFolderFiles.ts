// fetchFolderFiles.ts (Updated to handle null properly)
import { api } from "@/lib/api";
import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";

export async function fetchFiles(
  parentID: string | null,
  setFiles: Setter<fileMetaData[]>,
  setFileLoading: Setter<boolean>,
  setCursor: Setter<string | null>,
  cursor: string | null,
  limit: number
) {
  try {
    // Don't send cursor if it's null
    const parentIDParam = parentID === null ? 'null' : parentID;
    let url = `/user/files?parentID=${parentIDParam}&limit=${limit}`;

    // Only add cursor parameter if it exists and is not null
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    console.log("Fetching files with URL:", url);

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