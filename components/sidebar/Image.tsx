'use client'
import { imagemetadata } from '@/types/response';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ImageCard from '../image/ImageCard';

interface imageProp {
  userID: string
}

const Image: React.FC<imageProp> = ({ userID }) => {
  const [imageMetadata, setImageMetadata] = useState<imagemetadata[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3001/event/${userID}`);
    eventSource.onmessage = (event) => {
      const { userID, storagePath, fileUrl } = JSON.parse(event.data);
      // setImageMetadata(prevState => [...prevState, fileUrl]);
      console.log("userID", JSON.parse(event.data));
    }
  }, [userID])

  useEffect(() => {
    const fetchImageMetadata = async () => {
      const response = await axios.get(`http://localhost:3001/user/files/images/${userID}`);
      setImageMetadata(response.data.output);
    };
    if (userID) fetchImageMetadata();
  }, [userID]);


  return (
    <div className='grid gap-4 mt-20 w-full grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
      {imageMetadata.length > 0 && imageMetadata.map((imageMetadata: imagemetadata, index: number) => {
        return <ImageCard key={index} imageMetadata={imageMetadata} />
      })}
    </div>
  )
}

export default Image