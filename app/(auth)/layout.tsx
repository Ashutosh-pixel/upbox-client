import Image from 'next/image'
import React from 'react'
import cover from "../../public/assets/981f16b8-d413-4eca-bbf3-1ed1897aca40.jpg"

const AuthLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className='wrapper'>
    <section className='auth-section'>
        <div className='flex items-center bg-white w-screen h-screen overflow-hidden'>
            <div className='flex-grow w-full h-full'>
                {children}
            </div>
            <div className='flex-grow h-full w-full'>
                <Image 
                    src={cover} 
                    alt='cover'
                    className='h-full w-full object-cover'
                />
            </div>
        </div>
    </section>
</div>

  )
}

export default AuthLayout