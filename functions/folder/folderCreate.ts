import { api } from "@/lib/api";

export async function folderHandler(name: string, parentID: string | null) {
  try {
    if (!name.trim()) return;

    const output = await api.post(
      `/folder/createfolder`,
      { name, parentID, folderPath: name },
    );
    console.log("status", output.data.message);
    alert(output.data.message || output.data.error);
  } catch (error) {
    console.log("error is", error);
  }
}