"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check both adminToken (from /admin/login) and authToken (from /login)
    const adminToken = localStorage.getItem("adminToken");
    const authToken = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if ((adminToken || authToken) && role === "admin") {
      setIsVerified(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!isVerified) {
    return <Loading />;
  }

  return <>{children}</>;
}
