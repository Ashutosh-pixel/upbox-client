'use client'

import { reduxUserInfo } from "@/lib/redux/slice/userSlice";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";

const SideBarProfileBody = () => {
    const user: reduxUserInfo = useSelector((state: RootState) => state.user);

    return (
        <div className="px-4 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <h6 className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Guest User'}</h6>
                    <span className="text-xs text-gray-500 truncate block">{user?.email || 'guest@example.com'}</span>
                </div>
            </div>
        </div>
    )
}

export default SideBarProfileBody;