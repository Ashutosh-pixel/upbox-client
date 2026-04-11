import { selectedFiles, selectedFolders } from "@/types/folder";
import { Setter } from "@/types/global";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { uploadManager } from "./UploadManager";
import UploadTask2 from "./UploadTask2";
import { setUploadProgress, uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { store } from "@/lib/redux/store";
import { setRenamedArray } from "@/lib/redux/slice/renameArraySlice";
import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";

export class UploadFolderProcess {

    private baseUrl: string = '';
    private userID: string = '';
    private parentID: string | null = null;
    private folderMap: any;
    private files: any = [];
    private selectedFiles: selectedFiles[] = [];
    private selectedFolders: selectedFolders[] = [];
    private dispatch: Dispatch<UnknownAction>;


    constructor(baseUrl: string, fileInputRef: React.RefObject<HTMLInputElement | null>, userID: string, parentID: string | null, selectedFiles: selectedFiles[], selectedFolders: selectedFolders[], dispatch: Dispatch<UnknownAction>) {
        if (fileInputRef.current?.value) {
            fileInputRef.current.value = "";
        }

        this.baseUrl = baseUrl;
        this.userID = userID;
        this.parentID = parentID;
        this.selectedFiles = selectedFiles;
        this.selectedFolders = selectedFolders;
        this.dispatch = dispatch;


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

            const tempFileID = uuidv4();

            this.files.push(
                {
                    tempFileID: tempFileID,
                    tempID: tempFileID,
                    filename,
                    parentID,
                    type: this.selectedFiles[i].type
                }
            );
        }

        this.processFiles();
    }

    private async CheckFileDuplicate() {
        const userID = this.userID;
        const files = this.files;

        const filesRes = await axios.post(`${this.baseUrl}/folder/folderupload/bulkfilescheck`, { userID, files });
        const { duplicate, nonDuplicate } = await filesRes.data;

        console.log("dup", filesRes.data);
        return { duplicate, nonDuplicate };

    }

    private async processFiles() {

        const allTasks = new Map();

        for (let i = 0; i < this.selectedFiles.length; i++) {

            const fileMeta = this.files[i];
            const folderDoc = this.folderMap[this.selectedFiles[i].parent];

            const storagePath = `${folderDoc.storagePath}${uuidv4()}-${fileMeta.filename}`;
            const pathIds = [...folderDoc.pathIds, folderDoc._id];
            const pathNames = folderDoc.pathNames;

            const tempFileID = fileMeta.tempFileID;

            const uploadTask = new UploadTask2(
                0,
                this.baseUrl,
                this.selectedFiles[i].file,
                fileMeta.filename,
                folderDoc._id,
                this.userID,
                folderDoc._id,
                pathIds,
                pathNames,
                storagePath,
                tempFileID,
                this.dispatch
            );

            allTasks.set(tempFileID, uploadTask);
        }

        const { duplicate, nonDuplicate } = await this.CheckFileDuplicate();

        // Handle duplicates
        for (const dup of duplicate) {
            const task = allTasks.get(dup.tempFileID);
            if (!task) continue;

            uploadManager.globalDuplicateMap.set(dup.tempFileID, task);
        }

        this.dispatch(setRenamedArray(duplicate));

        // Handle non-duplicates
        for (const nonDup of nonDuplicate) {

            const task = allTasks.get(nonDup.tempFileID);
            if (!task) continue;

            const payload: uploadingProgress = {
                fileID: nonDup.tempFileID,
                fileName: nonDup.filename,
                uploadedBytes: 0,
                totalSize: task.file.size,
                status: "waiting",
                tempFileID: nonDup.tempFileID
            };

            store.dispatch(setUploadProgress(payload));

            uploadManager.queue.addTask(task);
        }
    }
}