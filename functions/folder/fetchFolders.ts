import { api } from "@/lib/api";
import { Setter } from "@/types/global";
import { folder } from "@/types/response";

export async function fetchFolders(parentID: string | null, setFolders: Setter<folder[]>, setLoading: Setter<boolean>) {
  try {
    setLoading(true);
    const output = await api.get(
      `/folder/getallfolder?parentID=${parentID}`,
    );
    setFolders(output.data.output);
  } catch (error) {
    console.log("error fetching folders", error);
  } finally {
    setLoading(false);
  }
};