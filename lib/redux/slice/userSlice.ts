import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface reduxUserInfo {
    email?: string,
    name?: string
}

const initialState: reduxUserInfo = {
    name: "",
    email: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<reduxUserInfo>) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
        }
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;