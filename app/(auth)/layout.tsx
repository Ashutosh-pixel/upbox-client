import Image from 'next/image'
import React from 'react'
import cover from "../../public/assets/981f16b8-d413-4eca-bbf3-1ed1897aca40.jpg"

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
            <div className="hidden lg:block flex-1 relative">
                <Image
                    src={cover}
                    alt='cover'
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
            </div>
        </div>
    )
}

export default AuthLayout