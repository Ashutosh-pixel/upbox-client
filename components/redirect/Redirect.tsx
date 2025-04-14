'use client'
import { response } from '@/types/response';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Redirect = () => {
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  useEffect(() => {
    const data = {userId: userId, secret: secret};
    const fetchData = async() => {
      try {
        const response = await axios.post("http://localhost:3000/api/signin", data, { withCredentials: true });
        console.log('response ==', response);
        // if(response.data.sessionId){
        //   router.push('/home');
        // }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData();
  }, []);

  return (
    <div>Redirect</div>
  )
}

export default Redirect