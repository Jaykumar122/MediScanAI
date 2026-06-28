"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token && role === 'doctor') {
      setIsVerified(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (!isVerified) return <Loading />;
  return <>{children}</>;
}
