import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface reduxFileUploadProgress {
    uploadID: string;
    fileName: string;
    uploadBytes: number;
    totalSize: number;
    isUploading: boolean;
}

const initialState: reduxFileUploadProgress[] = [];

const fileUploadProgressSlice = createSlice({
    name: "fileUploadProgress",
    initialState,
    reducers: {
        setFileUploadProgress: (state,action: PayloadAction<reduxFileUploadProgress>) => {

            const file = state.find(
                file => file.uploadID === action.payload.uploadID
            );

            if (file) {
                file.uploadBytes = action.payload.uploadBytes;
                file.totalSize = action.payload.totalSize;
                file.isUploading = action.payload.isUploading;
            }
            else{
                state.push(action.payload);
            }
        },

        clearFileUploadProgress: (state, action: PayloadAction<{uploadID: string}>) => {
            const file = state.find(file => file.uploadID === action.payload.uploadID);

            if(file){
                state = state.filter((item) => item.uploadID !== file.uploadID);
            }
        }
    }
})

export const {setFileUploadProgress, clearFileUploadProgress} = fileUploadProgressSlice.actions;
export default fileUploadProgressSlice.reducer;