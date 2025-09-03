import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface reduxClipboardFileInfo {
    name: string,
    parentID: string,
    userID: string,
    kind: string,
    originalStoragePath?: string,
    type?: string,
    size?: number
}

const initialState: reduxClipboardFileInfo = {
    name: "",
    parentID: "",
    userID: "",
    kind: "",
    originalStoragePath: "",
    type: "",
    size: 0
}

const clipboardSlice = createSlice({
    name: 'clipboard',
    initialState,
    reducers: {
        setClipboard: (state,action: PayloadAction<reduxClipboardFileInfo>) => {
            state.name = action.payload.name;
            state.parentID = action.payload.parentID;
            state.userID = action.payload.userID;
            state.kind = action.payload.kind;
            state.type = action.payload.type;
            state.size = action.payload.size;
            state.originalStoragePath = action.payload.originalStoragePath
        },

        clearClipboard: (state) => {
            state = initialState;
        }
    }
})

export const {setClipboard, clearClipboard} = clipboardSlice.actions;
export default clipboardSlice.reducer;



