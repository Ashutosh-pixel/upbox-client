'use client'
import React from "react";
import SideBarProfileBody from "@/components/sidebar/SideBarProfileBody";
import SideBarList from "@/components/sidebar/SideBarList";

const SideBar = () => {
    return (
        <div className="sidebar w-64 z-10 h-screen top-0 left-0 fixed bg-white border-r border-gray-100 flex flex-col">
            <SideBarProfileBody />
            <SideBarList />
        </div>
    )
}

export default SideBar;