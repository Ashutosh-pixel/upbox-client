/* NOT USING */
import { handleUploadFile } from "@/lib/fileUpload";
import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import { v4 as uuidv4 } from 'uuid';

export async function processFileUpload(userID: string, folderMap: any, duplicateFilesResponse: any, selectedFiles: selectedFiles[], setSelectedFiles: Setter<selectedFiles[]>, setUploadId: Setter<string[]>, setUploading: Setter<boolean>, setFileName: Setter<string[]>) {
    const duplicates = new Set(duplicateFilesResponse);

    let newRenamedFiles: selectedFiles[] = selectedFiles.map(file => {
        if (!duplicates.has(file.path)) return file; // not duplicate

        // split name into base + extension
        const dotIndex = file.name.lastIndexOf(".");
        const base = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
        const ext = dotIndex !== -1 ? file.name.substring(dotIndex) : "";

        const newName = `${base}-duplicate${ext}`;

        return {
            ...file,
            name: newName,
            path: `${file.parent ?? ""}${newName}`
        };
    });

    setSelectedFiles(newRenamedFiles);

    console.log('selectedFiles', newRenamedFiles)

    try {
        // step4: files uploading
        for (let i = 0; i < newRenamedFiles.length; i++) {
            const folderDoc = folderMap[newRenamedFiles[i].parent];
            const storagePath = `${folderDoc.storagePath}${uuidv4()}-${newRenamedFiles[i].name}`;
            const pathIds = [...folderDoc.pathIds, folderDoc._id];
            const pathNames = folderDoc.pathNames;
            const folderID = folderDoc._id;

            await handleUploadFile(
                newRenamedFiles[i].file,
                newRenamedFiles[i].name,
                folderID,
                userID,
                folderID,
                pathIds,
                pathNames,
                storagePath,
                setUploadId,
                setUploading,
                setFileName,
            );
        }
    } catch (err: any) {
        console.log("folder upload failed", err);
        if (err.response?.status === 409) {
            if (err.response?.data?.errorCode === "DUPLICATE_FILE") {
                console.log('duplicate');
                // if (setErrorMessage) {
                //   setErrorMessage(err.response?.data?.message);
                // }
            }
        }
    }
}