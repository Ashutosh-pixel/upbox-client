import Image from '@/components/sidebar/Image'
import React from 'react'
import FileUpload from '@/components/fileupload/FileUpload'
import FolderContainer from '@/components/folder/FolderContainer'
import FolderCreate from '@/components/folder/FolderCreate'

const page = () => {

  const userID = "68172b1df87d1cb0c096e49f"
  const parentID = "";

  return (
    <div>
      <div><FileUpload /></div>
      <FolderCreate parentID={null} />
      <FolderContainer userID={userID} parentID={parentID} />
      <Image userID={userID} />
    </div>
  )
}

export default page