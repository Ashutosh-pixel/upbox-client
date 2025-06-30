import React from "react";
import SideBar from "@/components/sidebar/SideBar";
import Navbar from "@/components/header/Navbar";

const RootLayout = ({children,}: { children: React.ReactNode }) => {
    return (
        <main className="flex relative">
            <SideBar/>
            <section className="flex flex-col ml-56 overflow-x-hidden w-full">
            <Navbar/>
                 <div>{children}</div>
            </section>
        </main>
    )
}

export default RootLayout;