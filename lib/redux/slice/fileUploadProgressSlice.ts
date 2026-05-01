import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface uploadingProgress {
    tempFileID: string,
    fileID: string,
    fileName: string,
    uploadedBytes: number,
    totalSize: number,
    status: "waiting" | "hashing" | "uploading" | "completed" | "aborted" | "paused"
}

const initialState: uploadingProgress[] = []

const fileUploadProgressSlice = createSlice({
    name: 'fileUploadProgress',
    initialState,
    reducers: {
        setUploadProgress: (state, action: PayloadAction<Partial<uploadingProgress> & { tempFileID: string }>) => {
            const index = state.findIndex(p => p.tempFileID === action.payload.tempFileID);

            if (index !== -1) {
                // MERGE the existing state with whatever new fields are in the payload
                state[index] = { ...state[index], ...action.payload };
            } else {
                // If it's a brand new file, we need the full object (cast as any to satisfy TS)
                state.push(action.payload as uploadingProgress);
            }
        },

        cleanUploadProgress: (state, action: PayloadAction<uploadingProgress>) => {
            // Remove specific upload (only for completed/aborted)
            const index = state.findIndex(p => p.tempFileID === action.payload.tempFileID);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    }
})

export const { setUploadProgress, cleanUploadProgress } = fileUploadProgressSlice.actions;
export default fileUploadProgressSlice.reducer;