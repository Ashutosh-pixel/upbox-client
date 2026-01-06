import { selectedFiles } from "@/types/folder";
import { afterRename, Setter } from "@/types/global";
import axios from "axios";

export async function RenameDuplicateFiles(originalFile: File | null, userID: string, duplicateFile: string, folderMap: any, selectedFiles: selectedFiles[], setAfterRenameArray: Setter<afterRename[]>) {
    try {
        console.log('selected', selectedFiles)
        const file = { originalName: '', type: "", action: 'rename' };
        const duplicateFileQuery = { userID: userID, parentID: "", file: file };

        selectedFiles.length > 0 && selectedFiles.map((f: selectedFiles) => {
            if (f.path === duplicateFile) {
                file['originalName'] = f.name;
                file["type"] = f.type;
                const parentID = folderMap[`${f.parent}`]._id;
                duplicateFileQuery["parentID"] = parentID;
            }
        })

        console.log('duplicateFileQuery', duplicateFileQuery)


        // send to server
        const initRes = await axios.post('http://localhost:3001/user/file/rename', duplicateFileQuery);

        const newRenamedFileRecord: afterRename = {
            uploadId: await initRes.data.uploadId,
            fileName: await initRes.data.fileName,
            parentID: await initRes.data.parentID,
            fileID: await initRes.data.fileID,
            userID: await initRes.data.userID,
            storagePath: await initRes.data.storagePath,
            file: originalFile
        }

        setAfterRenameArray((prev) => [...prev, newRenamedFileRecord]);

    } catch (error) {
        console.log('error while rename', error)
    }
}