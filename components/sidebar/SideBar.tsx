import React from "react";
import SideBarProfileBody from "@/components/sidebar/SideBarProfileBody";
import SideBarList from "@/components/sidebar/SideBarList";

const  SideBar = () => {
    return (
        <div className=" sidebar-header flex w-56 z-10 h-screen top-0 left-0 shadow-xl flex-col fixed overflow-y-auto bg-white">
            <hr/>
           <SideBarProfileBody/>
            <hr className="mt-10"/>
            <SideBarList/>
        </div>
    )
}

export default  SideBar;