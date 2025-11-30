import { Setter } from "@/types/global";
import { fileMetaData } from "@/types/response";
import axios from "axios";

export async function fetchFiles(url: string, parentID: string|null, userID: string, setFiles: Setter<fileMetaData[]>, setFileLoading: Setter<boolean>) {
  try {
    const response = await axios.get(
      `${url}/user/files?parentID=${parentID}&userID=${userID}`,
    );
    console.log("response", response);
    setFiles(response.data.output);
  } catch (error) {
    console.log("error fetching filemetadata", error);
  } finally {
    setFileLoading(false);
  }
}
