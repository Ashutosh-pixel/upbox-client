import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";

export function processFileUpload(event: any, parentID: string|null, setSelectedFiles: Setter<selectedFiles[]>, setSelectedFolders: Setter<selectedFolders[]>) {
  const filelist = event.target.files;
  const newPath = new Set<string>();

  // extract and arrange selected files
  const selectedFile = [];
  for (let i = 0; i < filelist.length; i++) {
    const newFile: selectedFiles = {
      name: filelist[i].name,
      path: filelist[i].webkitRelativePath,
      parent:
        filelist[i].webkitRelativePath.substring(
          0,
          filelist[i].webkitRelativePath.lastIndexOf("/"),
        ) + "/",
      size: filelist[i].size,
      type: filelist[i].type,
      file: filelist[i],
    };
    const path = filelist[i].webkitRelativePath;
    newPath.add(path.substring(0, path.lastIndexOf("/")));
    selectedFile.push(newFile);
  }

  // extract and arrange selected folders
  const selectedFolder = [];
  for (const folderPath of newPath) {
    const newFolder: selectedFolders = {
      name: folderPath.substring(folderPath.lastIndexOf("/") + 1),
      parent: folderPath.substring(0, folderPath.lastIndexOf("/")) + "/",
      path: folderPath + "/",
    };
    selectedFolder.push(newFolder);
  }
  if (selectedFolder.length > 0) {
    selectedFolder[0].parent = parentID;
  }
  setSelectedFiles(selectedFile);
  setSelectedFolders(selectedFolder);
}
