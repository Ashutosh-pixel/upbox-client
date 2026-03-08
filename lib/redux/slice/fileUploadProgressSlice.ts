import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface uploadingProgress {
    tempFileID: string,
    fileID: string | null,
    fileName: string,
    uploadedBytes: number,
    totalSize: number,
    status: "waiting" | "hashing" | "uploading" | "completed"
}

const initialState: uploadingProgress[] = []

const fileUploadProgressSlice = createSlice({
    name: 'fileUploadProgress',
    initialState,
    reducers: {
        setUploadProgress: (state, action: PayloadAction<uploadingProgress>) => {

            const file = state.find(progress => progress.tempFileID === action.payload.tempFileID)

            if (file) {
                file.uploadedBytes = action.payload.uploadedBytes;
                file.totalSize = action.payload.totalSize;
                file.fileID = action.payload.fileID;
                file.status = action.payload.status;
            }

            else {
                state.push(action.payload);
            }
        },

        cleanUploadProgress: (state, action: PayloadAction<uploadingProgress>) => {

            state = state.filter(progress => progress.tempFileID !== action.payload.tempFileID);

        }
    }
})

export const { setUploadProgress, cleanUploadProgress } = fileUploadProgressSlice.actions;
export default fileUploadProgressSlice.reducer;