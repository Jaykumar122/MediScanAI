"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && (role === 'patient' || role === 'doctor' || role === 'pharmacist')) {
      setIsVerified(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (!isVerified) {
    return <Loading />;
  }

  return <>{children}</>;
}
