import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { uploadManager } from "./UploadManager";
import UploadTask2 from "./UploadTask2";
import { setUploadProgress, uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { store } from "@/lib/redux/store";

export class UploadFolderProcess {

    private baseUrl: string = '';
    private userID: string = '';
    private parentID: string | null = null;
    private folderMap: any;
    private files: any = [];
    private selectedFiles: selectedFiles[] = [];
    private selectedFolders: selectedFolders[] = [];


    constructor(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, userID: string, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[]) {
        if (fileInputRef.current?.value) {
            fileInputRef.current.value = "";
        } else {
            console.log("select files");
            return;
        }

        this.baseUrl = baseUrl;
        this.userID = userID;
        this.parentID = parentID;
        this.selectedFiles = selectedFiles;
        this.selectedFolders = selectedFolders;


        this.folderCreateOnBackend();
    }

    private async folderCreateOnBackend() {
        const userID = this.userID;
        const parentID = this.parentID;

        const output = await axios.post(
            `${this.baseUrl}/folder/uploadfolder`,
            { userID, parentID, folders: this.selectedFolders, fileMeta: this.selectedFiles },
        );

        this.folderMap = output.data.folderMap;

        this.foldersProcess();
    }

    private foldersProcess() {
        for (let i = 0; i < this.selectedFiles.length; i++) {
            const folderDoc = this.folderMap[this.selectedFiles[i].parent];
            const filename = this.selectedFiles[i].name;
            const parentID = folderDoc._id;

            this.files.push(
                {
                    filename,
                    parentID
                }
            );
        }

        this.CheckFileDuplicate();
    }

    private async CheckFileDuplicate() {
        const userID = this.userID;
        const files = this.files;

        const filesRes = await axios.post(`${this.baseUrl}/folder/folderupload/bulkfilescheck`, { userID, files });
        const duplicateFiles = filesRes.data.output.duplicate;

        /*         setDuplicateFilesResponse(duplicateFiles);
                setFolderMap(folderMap) */

        if (duplicateFiles.length > 0) {
            return;
        }

        this.processFiles();

    }

    private async processFiles() {
        for (let i = 0; i < this.selectedFiles.length; i++) {
            const folderDoc = this.folderMap[this.selectedFiles[i].parent];
            const storagePath = `${folderDoc.storagePath}${uuidv4()}-${this.selectedFiles[i].name}`;
            const pathIds = [...folderDoc.pathIds, folderDoc._id];
            const pathNames = folderDoc.pathNames;
            const folderID = folderDoc._id;

            let index = 0;
            let tempFileID = uuidv4();
            let uploadTask = new UploadTask2(index, this.baseUrl, this.selectedFiles[i].file, this.selectedFiles[i].name, folderID, this.userID, folderID, pathIds, pathNames, storagePath, tempFileID);

            let payload: uploadingProgress = {
                fileID: tempFileID,
                fileName: this.selectedFiles[i].name,
                uploadedBytes: 0,
                totalSize: this.selectedFiles[i].file.size,
                status: "waiting",
                tempFileID: tempFileID
            }

            store.dispatch(setUploadProgress(payload))

            uploadManager.queue.addTask(uploadTask);
        }
    }
}