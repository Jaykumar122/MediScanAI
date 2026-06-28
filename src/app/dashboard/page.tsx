"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

type UserRole = "doctor" | "patient" | "pharmacist" | "admin";

const ROLE_ROUTES: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  doctor: "/dashboard/doctor",
  patient: "/dashboard/patient",
  pharmacist: "/dashboard/pharmacist",
};

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") as UserRole | null;

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    const destination = ROLE_ROUTES[role] ?? "/login";
    router.replace(destination);
  }, [router]);

  return <Loading />;
}
