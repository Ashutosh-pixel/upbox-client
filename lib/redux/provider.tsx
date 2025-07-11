'use client'
import {Provider} from "react-redux";
import {store} from "@/lib/redux/store";
import {ReactNode} from "react";

interface Props{
    children: ReactNode;
}

export function ReduxProvider({children}: Props){
    return <Provider store={store}>{children}</Provider>
}