import {configureStore} from "@reduxjs/toolkit";
import userReducer from './slice/userSlice'
import clipboardSlice from "@/lib/redux/slice/clipboardSlice";
import sseConnectSlice from "./slice/sseConnectSlice";
import fileUploadProgressSlice from "./slice/fileUploadProgressSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        clipboard: clipboardSlice,
        sse: sseConnectSlice,
        fileUploadProgress: fileUploadProgressSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;