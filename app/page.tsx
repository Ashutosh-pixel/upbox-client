'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/drive');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse">Redirecting...</div>
        </div>
    );
}