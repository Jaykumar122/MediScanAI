"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');

    if (token && role === 'admin') {
      setIsVerified(true);
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  if (!isVerified) {
    return <Loading />;
  }

  return <>{children}</>;
}
