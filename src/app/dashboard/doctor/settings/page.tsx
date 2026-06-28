"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, User } from "lucide-react";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
  specialization?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const logout = async () => {
    try { await axios.post("/api/logout"); } catch {}
    ["authToken", "authTokenExpiresAt", "user", "userRole", "lastEmail", "rememberMe"].forEach((key) => localStorage.removeItem(key));
    router.replace("/login");
  };

  const displayName = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Doctor";

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your doctor account and session.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">Dr. {displayName}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{user.email || "Not available"}</p></div>
            <div className="flex gap-2"><Badge>{user.role || "doctor"}</Badge>{user.specialization && <Badge variant="outline">{user.specialization}</Badge>}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Account Actions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Your session automatically expires after 2 days. Use logout to end it immediately.</p>
            <Button variant="destructive" onClick={logout} className="gap-2"><LogOut className="h-4 w-4" /> Log out</Button>
          </CardContent>
        </Card>
      </div>
    </DoctorPageShell>
  );
}
