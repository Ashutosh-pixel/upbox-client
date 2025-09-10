import { imagemetadata } from '@/types/response'
import Image, { StaticImageData } from 'next/image'
import React, { useEffect, useState } from 'react'
import placeholderImage from '@/public/assets/5f9da896-a466-4190-ab37-04831e3ccbcc.jpg'
import { dateFormat } from '@/lib/utils'
import axios from 'axios'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/redux/store";
import {setClipboard} from "@/lib/redux/slice/clipboardSlice";

interface ImageCardProps {
    imageMetadata: imagemetadata
}

const ImageCard: React.FC<ImageCardProps> = ({ imageMetadata }) => {

  const [imageSrc, setImageSRC] = useState<string | StaticImageData>(placeholderImage);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/file/image?path=${imageMetadata.storagePath}`, {
          responseType: 'blob'
        });

        const imageUrl = URL.createObjectURL(response.data);
        setImageSRC(imageUrl);

        return () => {
          URL.revokeObjectURL(imageUrl);
        }

      } catch (error) {
        console.log('Image Fetching Failed', error)
      }
    }

    fetchImage();
  }, [imageMetadata.storagePath])

    const copyFile = () => {
      const fileMetadata = {
          id: imageMetadata._id,
          name: imageMetadata.filename,
          userID: imageMetadata.userID,
          type: imageMetadata.type,
          size: imageMetadata.size,
          parentID: imageMetadata.parentID,
          kind: 'file',
          originalStoragePath: imageMetadata.storagePath
      }
      dispatch(setClipboard(fileMetadata));
    }

  return (
    <div className='p-4 bg-white rounded-xl'>
      <div className='relative w-full h-64 overflow-hidden rounded-xl'>
        <Image src={imageSrc} alt={imageMetadata.filename} className='rounded-xl object-contain' fill/>
      </div>
      <div className='mt-2'>
        <div>Created on {dateFormat(imageMetadata.uploadTime)}</div>
        <div className='break-words whitespace-normal'>Gallery-{imageMetadata.filename}</div>
      </div>
      <div className='mt-2'>You opened {dateFormat(imageMetadata.updatedAt)}</div>
        <div>
            <button onClick={() => copyFile()}>copy</button>
        </div>
    </div>
  )
}

export default ImageCard