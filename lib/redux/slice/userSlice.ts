import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface reduxUserInfo {
    email?: string,
    name?: string,
    id?: string
}

const initialState: reduxUserInfo = {
    name: "",
    email: "",
    id: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<reduxUserInfo>) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.id = action.payload.id;
        }
    }
})

export const {setUser} = userSlice.actions;
export default userSlice.reducer;