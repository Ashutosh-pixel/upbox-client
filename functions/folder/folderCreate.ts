import axios from "axios";

export async function folderHandler(url: string, name: string, parentID: string|null, userID: string) {
  try {
    console.log('base', url)
    const output = await axios.post(
      `${url}/folder/createfolder`,
      { name, parentID, userID, folderPath: name },
    );
    console.log("status", output.data.message);
    alert(output.data.message || output.data.error);
  } catch (error) {
    console.log("error is", error);
  }
}