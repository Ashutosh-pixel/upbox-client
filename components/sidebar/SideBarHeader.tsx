import Image from "next/image";
import logo from "@/public/assets/logo.svg";
import React from "react";

const sideBarHeader = () => {
    return (
        <div className="flex items-start w-full justify-between">
            <div className="flex w-full justify-between items-center">
                <div className="flex items-center p-3">
                    <Image src={logo} alt="logo" width={40}></Image>
                    <h4 className="text-2xl ml-4">UpBox</h4>
                </div>
            </div>
        </div>
    )
}

export default  sideBarHeader;