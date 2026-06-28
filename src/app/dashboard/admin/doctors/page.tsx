"use client";

import { CSSProperties, useEffect, useState } from "react";
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

interface Doctor {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  specialization?: string;
  phone?: string;
  mobileNumber?: string;
  govId?: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  available: "bg-green-100 text-green-800 border-green-200",
  out_of_stock: "bg-red-100 text-red-800 border-red-200",
  outofstock: "bg-red-100 text-red-800 border-red-200",
  low_stock: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function getDisplayName(doctor: Doctor) {
  const fullName = [doctor.firstName, doctor.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || doctor.name || "—";
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("/api/dashboard/admin/doctors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setDoctors(d.data ?? d.doctors ?? d ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load doctors");
        setLoading(false);
      });
  }, []);

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      getDisplayName(d).toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
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
                  <CardTitle>Doctors</CardTitle>
                  <CardDescription>
                    Registered doctors on the platform
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {doctors.length} total
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
                          Specialization
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
                            colSpan={7}
                            className="px-4 py-10 text-center text-muted-foreground"
                          >
                            No doctors found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((doctor) => (
                          <tr
                            key={doctor._id}
                            className="border-b last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-4 py-3 font-medium">
                              {getDisplayName(doctor)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {doctor.email}
                            </td>
                            <td className="px-4 py-3">
                              {doctor.specialization ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {doctor.mobileNumber ?? doctor.phone ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {doctor.govId ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[doctor.status?.toLowerCase()] ??
                                  "bg-gray-100 text-gray-700"
                                }
                              >
                                {doctor.status?.replaceAll("_", " ")}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {doctor.createdAt
                                ? new Date(
                                    doctor.createdAt,
                                  ).toLocaleDateString()
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
