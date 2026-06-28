"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Pharmacist {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  govId?: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export default function PharmacyPage() {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("/api/dashboard/admin/pharmacy", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setPharmacists(d.data ?? d.pharmacists ?? d ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load pharmacists");
        setLoading(false);
      });
  }, []);

  const filtered = pharmacists.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
    );
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Pharmacists</CardTitle>
                  <CardDescription>
                    Registered pharmacists on the platform
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {pharmacists.length} total
                </Badge>
              </div>

              {/* Search */}
              <div className="relative mt-4 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="p-6 text-center text-destructive">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="text-left px-4 py-3 font-medium">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Email
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Phone
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          License (Gov ID)
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-10 text-center text-muted-foreground"
                          >
                            No pharmacists found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((p) => (
                          <tr
                            key={p._id}
                            className="border-b last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-4 py-3 font-medium">{p.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.email}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.phone ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {p.govId ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[p.status?.toLowerCase()] ??
                                  "bg-gray-100 text-gray-700"
                                }
                              >
                                {p.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
