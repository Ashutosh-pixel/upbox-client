import React from "react";
import SideBar from "@/components/sidebar/SideBar";
import Navbar from "@/components/header/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <SideBar />
            <div className="flex-1 flex flex-col ml-64 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default RootLayout;