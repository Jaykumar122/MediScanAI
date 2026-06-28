"use client";

import { useEffect, useMemo, useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pill, Search } from "lucide-react";

type Drug = {
  _id: string;
  name?: string;
  category?: string;
  manufacturer?: string;
  stock?: number;
  unit?: string;
  price?: number;
  requiresPrescription?: boolean;
  status?: string;
};

export default function DrugsPage() {
  const [items, setItems] = useState<Drug[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/dashboard/doctor/resources?type=drugs&search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load drugs");
        const json = await res.json();
        setItems(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load drugs");
      } finally {
        setLoading(false);
      }
    };
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const lowStock = useMemo(() => items.filter((drug) => Number(drug.stock || 0) < 10).length, [items]);
  const available = useMemo(() => items.filter((drug) => Number(drug.stock || 0) > 0).length, [items]);

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Drugs & Medicines</h1>
        <p className="text-muted-foreground">Read-only inventory list for prescription planning.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Drugs</p><p className="text-3xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Available</p><p className="text-3xl font-bold text-green-600">{available}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-3xl font-bold text-orange-600">{lowStock}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5" /> Medicine Library</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search drug, category or manufacturer..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading drugs...</p> : error ? <p className="text-red-600">{error}</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="py-3">Name</th><th>Category</th><th>Manufacturer</th><th>Stock</th><th>Price</th><th>Prescription</th><th>Status</th></tr></thead>
                <tbody>
                  {items.map((drug) => (
                    <tr key={drug._id} className="border-b hover:bg-muted/40">
                      <td className="py-3 font-medium">{drug.name || "Unnamed"}</td>
                      <td>{drug.category || "—"}</td>
                      <td>{drug.manufacturer || "—"}</td>
                      <td>{drug.stock ?? 0} {drug.unit || "units"}</td>
                      <td>{drug.price !== undefined ? `₹${drug.price}` : "—"}</td>
                      <td><Badge variant={drug.requiresPrescription ? "default" : "secondary"}>{drug.requiresPrescription ? "Required" : "No"}</Badge></td>
                      <td><Badge variant={drug.status === "out_of_stock" ? "destructive" : "outline"}>{drug.status || "available"}</Badge></td>
                    </tr>
                  ))}
                  {items.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No drugs found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DoctorPageShell>
  );
}
