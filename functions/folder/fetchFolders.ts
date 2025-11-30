import { Setter } from "@/types/global";
import { folder } from "@/types/response";
import axios from "axios";

export async function fetchFolders(baseUrl: string, userID: string, parentID: string|null, setFolders: Setter<folder[]>, setLoading: Setter<boolean>){
  try {
    setLoading(true);
    const output = await axios.get(
      `${baseUrl}/folder/getallfolder?parentID=${parentID}&userID=${userID}`,
    );
    setFolders(output.data.output);
  } catch (error) {
    console.log("error fetching folders", error);
  } finally {
    setLoading(false);
  }
};