import React from "react";
import SideBar from "@/components/sidebar/SideBar";
import Navbar from "@/components/header/Navbar";

const RootLayout = ({children,}: { children: React.ReactNode }) => {
    return (
        <main className="flex h-full bg-[#f9f9f9]">
            <SideBar/>
            <section className="flex flex-col w-full">
            <Navbar/>
                 <div>{children}</div>
            </section>
        </main>
    )
}

export default RootLayout;