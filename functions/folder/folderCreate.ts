import { api } from "@/lib/api";

export async function folderHandler(name: string, parentID: string | null) {
  try {
    if (!name.trim()) return;

    const output = await api.post(
      `/folder/createfolder`,
      { name, parentID, folderPath: name },
    );
    console.log("status", output.data.message);
    // alert(output.data.message || output.data.error);
    return { success: true };
  } catch (error: any) {
    console.log("error is", error);

    if (error.response?.status === 409) {
      if (error.response?.data?.errorCode === "DUPLICATE_FOLDER") {
        console.log('duplicate');
        return { success: false, error: "A folder with this name already exists" };
      }
    }

    return { success: false, error: error.response?.data?.message || "Failed to create folder" };
  }
}