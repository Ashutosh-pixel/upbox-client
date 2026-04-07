import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface rename {
    _id: string;
    tempID: string;
    filename: string;
    parentID: string | null;
    type: string;
}

const initialState: rename[] = [];

const renameArraySlice = createSlice({
    name: 'renameArray',
    initialState,
    reducers: {
        setRenamedArray: (state, action: PayloadAction<rename[]>) => {
            state.push(...action.payload);
        },

        clearRenamedArray: (state, action: PayloadAction<rename>) => {
            return state.filter(file => file._id !== action.payload._id);
        },

        clearAllRenameArray: (state) => {
            return [];
        }
    }
})

export const { setRenamedArray, clearRenamedArray, clearAllRenameArray } = renameArraySlice.actions;
export default renameArraySlice.reducer;