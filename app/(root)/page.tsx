"use client"
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {

  const router = useRouter();

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

  }, [loading, isAuthenticated])

  return (
    <div>
      Home
    </div>
  )
}

export default page;