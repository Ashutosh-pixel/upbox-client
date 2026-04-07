import axios from "axios";
import { uploadManager } from "./UploadManager";
import { Dispatch } from "react";
import { UnknownAction } from "@reduxjs/toolkit";
import { rename, setRenamedArray } from "@/lib/redux/slice/renameArraySlice";
import { v4 as uuidv4 } from 'uuid';

export async function uploadDuplicateCheck(
    baseUrl: string,
    file: File,
    userID: string,
    parentID: string | null,
    task: any, // ✅ NEW: pass task
    dispatch: Dispatch<UnknownAction>
) {
    try {
        const files = [{ filename: file.name, parentID, type: file.type }];

        const res = await axios.post(`${baseUrl}/user/file/checkduplicatefiles`, { userID, files });

        const duplicateFiles = res.data.duplicate;

        if (duplicateFiles && Array.isArray(duplicateFiles) && duplicateFiles.length) {

            duplicateFiles.forEach((dup: any) => {
                const tempID = uuidv4();

                dup.tempID = tempID;

                // store TASK
                uploadManager.globalDuplicateMap.set(tempID, task);
            });

            dispatch(setRenamedArray(duplicateFiles));

            return true; // duplicate exists
        }

        return false; // no duplicate

    } catch (error) {
        console.log("Failed to check duplicate files", error);
        return false;
    }
}