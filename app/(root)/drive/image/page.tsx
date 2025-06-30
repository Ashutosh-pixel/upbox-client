'use client'
import Image from '@/components/sidebar/Image'
import React, { useEffect, useState } from 'react'
import FileUpload from '@/components/fileupload/FileUpload'

const page = () => {
  let userID = "681cbca24c31bfa9b698a961"
  
  return (
    <div>
        <div><FileUpload/></div>
        <Image userID={userID}/>
    </div>
  )
}

export default page