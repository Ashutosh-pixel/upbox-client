import React from "react";
import SideBarProfileBody from "@/components/sidebar/SideBarProfileBody";
import SideBarList from "@/components/sidebar/SideBarList";

const  SideBar = () => {
    return (
        <div className=" sidebar-header flex w-3xs z-10 shadow-lg flex-col overflow-auto">
            <hr/>
           <SideBarProfileBody/>
            <hr className="mt-10"/>
            <SideBarList/>
        </div>
    )
}

export default  SideBar;