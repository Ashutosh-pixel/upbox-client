'use client'
import { logout } from "@/functions/logout/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Image, Video, FileText, LogOut, Home } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import DiskProgressBar from "../progressBar/StorageProgressBar";
import { reduxUserInfo } from "@/lib/redux/slice/userSlice";

const SideBarList = () => {
    const pathname = usePathname();
    const user: reduxUserInfo = useSelector((state: RootState) => state.user);

    const navItems = [
        { icon: Folder, label: 'All Files', href: '/drive' },
        { icon: Image, label: 'Images', href: '/drive/image' },
        { icon: Video, label: 'Videos', href: '/drive/video' },
        { icon: FileText, label: 'Documents', href: '/drive/document' },
    ];

    const isActive = (href: string) => {
        if (href === '/drive') return pathname === '/drive' || pathname === '/drive/';
        return pathname?.startsWith(href);
    };

    return (
        <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-100">
                <DiskProgressBar total={user.totalStorage} used={user.usedStorage} />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </nav>
    )
}

export default SideBarList;