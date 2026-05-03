import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface reduxUserInfo {
    email?: string,
    name?: string,
    totalStorage: number,
    usedStorage: number
}

export type storage = {
    usedStorage: number
}

const initialState: reduxUserInfo = {
    name: "",
    email: "",
    totalStorage: 0,
    usedStorage: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<reduxUserInfo>) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.totalStorage = action.payload.totalStorage;
            state.usedStorage = action.payload.usedStorage;
        },
        updateStorage: (state, action: PayloadAction<storage>) => {
            state.usedStorage = action.payload.usedStorage;
        }
    }
})

export const { setUser, updateStorage } = userSlice.actions;
export default userSlice.reducer;