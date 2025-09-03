import {configureStore} from "@reduxjs/toolkit";
import userReducer from './slice/userSlice'
import clipboardSlice from "@/lib/redux/slice/clipboardSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        clipboard: clipboardSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;