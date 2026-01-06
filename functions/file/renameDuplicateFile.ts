import { afterRename, Setter } from "@/types/global";
import axios from "axios";

export async function RenameDuplicateFile(originalFile: File | null, userID: string, parentID: string | null, setAfterRenameArray: Setter<afterRename[]>) {
    try {
        const file = { originalName: originalFile?.name, type: originalFile?.type, action: 'rename' };
        const duplicateFileQuery = { userID: userID, parentID: parentID, file: file };

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
        console.log('rename duplicate file error', error)
    }
}