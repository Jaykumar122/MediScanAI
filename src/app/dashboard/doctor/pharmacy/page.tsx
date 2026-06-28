"use client";

import { useEffect, useMemo, useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";

type Pharmacist = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  govId?: string;
  status?: string;
};

export default function PharmacyPage() {
  const [items, setItems] = useState<Pharmacist[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/dashboard/doctor/resources?type=pharmacy&search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load pharmacy data");
        const json = await res.json();
        setItems(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pharmacy data");
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
        <h1 className="text-2xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">Find pharmacists available for prescription fulfillment.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Pharmacists</p><p className="text-3xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Pharmacists</p><p className="text-3xl font-bold text-green-600">{activeCount}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Pharmacy Directory</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pharmacy contacts..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading pharmacy...</p> : error ? <p className="text-red-600">{error}</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="py-3">Name</th><th>Email</th><th>Phone</th><th>License</th><th>Status</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-muted/40">
                      <td className="py-3 font-medium">{[item.firstName, item.lastName].filter(Boolean).join(" ") || "Unnamed"}</td>
                      <td>{item.email || "—"}</td>
                      <td>{item.mobileNumber || "—"}</td>
                      <td>{item.govId || "—"}</td>
                      <td><Badge variant={item.status === "inactive" ? "destructive" : "default"}>{item.status || "active"}</Badge></td>
                    </tr>
                  ))}
                  {items.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No pharmacy users found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DoctorPageShell>
  );
}
