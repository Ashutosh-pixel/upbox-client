'use client'
import { imagemetadata } from '@/types/response';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ImageCard from '../image/ImageCard';

interface imageProp {
  userID: string
  parentID: string | null
}

const Image: React.FC<imageProp> = ({ userID, parentID }) => {
  const [imageMetadata, setImageMetadata] = useState<imagemetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3001/event/${userID}`);
    eventSource.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setImageMetadata((prevResponse) => [...prevResponse, response]);
    }
    return () => eventSource.close()
  }, [userID])

  useEffect(() => {
    const fetchImageMetadata = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/user/files/images?parentID=${parentID}&userID=${userID}`);
        setImageMetadata(response.data.output);
      } catch (error) {
        console.log('error fetching imagemetatdata', error)
      }
      finally {
        setLoading(false);
      }
    };
    if (userID) fetchImageMetadata();
  }, [userID, parentID]);


  return (
    <div className='grid gap-4 mt-20 w-full grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
      {loading ? <div>Loading File....</div> :
        imageMetadata.length > 0 && imageMetadata.map((imageMetadata: imagemetadata, index: number) => {
          return <ImageCard key={index} imageMetadata={imageMetadata} />
        })
      }
    </div>
  )
}

export default Image