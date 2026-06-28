"use client";

import { useEffect, useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText } from "lucide-react";

type DoctorStats = { totalPrescriptions: number; prescriptionsThisMonth: number; activePrescriptions: number };

export default function ReportsPage() {
  const [stats, setStats] = useState<DoctorStats>({ totalPrescriptions: 0, prescriptionsThisMonth: 0, activePrescriptions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/dashboard/doctor", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setStats(json.data?.stats || json.stats || stats);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Prescription activity reports and dashboard insights.</p>
      </div>
      {loading ? <p className="text-muted-foreground">Loading reports...</p> : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Total Prescriptions</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.totalPrescriptions}</p><Badge className="mt-3" variant="outline">All time</Badge></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> This Month</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-blue-600">{stats.prescriptionsThisMonth}</p><Badge className="mt-3" variant="outline">Current month</Badge></CardContent></Card>
          <Card><CardHeader><CardTitle>Active QR Prescriptions</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-green-600">{stats.activePrescriptions}</p><Badge className="mt-3" variant="outline">Scans remaining</Badge></CardContent></Card>
        </div>
      )}
    </DoctorPageShell>
  );
}
