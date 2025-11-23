import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SSEState = {
    files: any[];
    folders: any[];
}

const initialState: SSEState = {
    files: [],
    folders: []
}

const sseConnectSlice = createSlice({
    name: "sseConnect",
    initialState,
    reducers: {
        setFolders: (state, action: PayloadAction<any>) => {
            console.log('payload', action.payload)
            state.folders.unshift(action.payload);
        },

        addFile: (state, action: PayloadAction<any>) => {
            state.files = [action.payload];
        },

        addFolder: (state, action: PayloadAction<any>) => {
            state.folders.unshift(action.payload);
        }
    }
})

export const { setFolders, addFile, addFolder } = sseConnectSlice.actions;
export default sseConnectSlice.reducer;