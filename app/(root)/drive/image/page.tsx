'use client'
import Image from '@/components/sidebar/Image'
import React from 'react'
import FileUpload from '@/components/fileupload/FileUpload'

const page = () => {
  const userID = "681cbca24c31bfa9b698a961"
  
  return (
    <div>
        <div><FileUpload/></div>
        <Image userID={userID}/>
    </div>
  )
}

export default page