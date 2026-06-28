"use client";

import { useEffect, useMemo, useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Stethoscope, Search } from "lucide-react";

type Doctor = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  specialization?: string;
  govId?: string;
  status?: string;
};

export default function DoctorsPage() {
  const [items, setItems] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/dashboard/doctor/resources?type=doctors&search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load doctors");
        const json = await res.json();
        setItems(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const activeCount = useMemo(() => items.filter((item) => item.status !== "inactive").length, [items]);

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
        <p className="text-muted-foreground">Browse doctors connected to MediScan AI.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Doctors</p><p className="text-3xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold text-green-600">{activeCount}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Specializations</p><p className="text-3xl font-bold text-blue-600">{new Set(items.map((i) => i.specialization).filter(Boolean)).size}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Doctor Directory</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or specialization..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading doctors...</p> : error ? <p className="text-red-600">{error}</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="py-3">Name</th><th>Email</th><th>Phone</th><th>Specialization</th><th>License</th><th>Status</th></tr></thead>
                <tbody>
                  {items.map((doctor) => (
                    <tr key={doctor._id} className="border-b hover:bg-muted/40">
                      <td className="py-3 font-medium">Dr. {[doctor.firstName, doctor.lastName].filter(Boolean).join(" ") || "Unnamed"}</td>
                      <td>{doctor.email || "—"}</td>
                      <td>{doctor.mobileNumber || "—"}</td>
                      <td>{doctor.specialization || "General"}</td>
                      <td>{doctor.govId || "—"}</td>
                      <td><Badge variant={doctor.status === "inactive" ? "destructive" : "default"}>{doctor.status || "active"}</Badge></td>
                    </tr>
                  ))}
                  {items.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No doctors found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DoctorPageShell>
  );
}
