"use client";

import { CSSProperties, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Stethoscope,
  UserRound,
  FlaskConical,
  FileText,
  Pill,
} from "lucide-react";

interface DashboardData {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalPharmacists: number;
  totalPrescriptions: number;
  totalDrugs: number;
  recentUsers: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }[];
  recentPrescriptions: {
    _id: string;
    patientName: string;
    symptoms: string;
    medications: { name: string }[];
    createdAt: string;
  }[];
}

const statCards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "totalDoctors",
    label: "Doctors",
    icon: Stethoscope,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "totalPatients",
    label: "Patients",
    icon: UserRound,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "totalPharmacists",
    label: "Pharmacists",
    icon: FlaskConical,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "totalPrescriptions",
    label: "Prescriptions",
    icon: FileText,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    key: "totalDrugs",
    label: "Drugs",
    icon: Pill,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  doctor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  patient: "bg-blue-100 text-blue-800 border-blue-200",
  pharmacist: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function getDisplayName(user: DashboardData["recentUsers"][number]) {
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || user.name || "—";
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not logged in");
      setLoading(false);
      return;
    }

    fetch("/api/dashboard/admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setData(d.data ?? d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

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
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {loading && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
              <div className="h-64 rounded-xl bg-muted animate-pulse" />
              <div className="h-64 rounded-xl bg-muted animate-pulse" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {statCards.map(({ key, label, icon: Icon, color, bg }) => (
                  <Card key={key}>
                    <CardContent className="flex flex-col gap-2 pt-5">
                      <div
                        className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
                      >
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div className={`text-2xl font-bold ${color}`}>
                        {(data as unknown as Record<string, number>)[key] ?? 0}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
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
                            Role
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
                        {(data.recentUsers ?? []).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-muted-foreground"
                            >
                              No recent users
                            </td>
                          </tr>
                        ) : (
                          (data.recentUsers ?? []).map((user) => (
                            <tr
                              key={user._id}
                              className="border-b last:border-0 hover:bg-muted/30"
                            >
                              <td className="px-4 py-3 font-medium">
                                {getDisplayName(user)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {user.email}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    roleColors[user.role?.toLowerCase()] ??
                                    "bg-gray-100 text-gray-700"
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    statusColors[user.status?.toLowerCase()] ??
                                    "bg-gray-100 text-gray-700"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {user.createdAt
                                  ? new Date(
                                      user.createdAt,
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Recent Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-4 py-3 font-medium">
                            Patient
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Symptoms
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Medications
                          </th>
                          <th className="text-left px-4 py-3 font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data.recentPrescriptions ?? []).length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                            >
                              No recent prescriptions
                            </td>
                          </tr>
                        ) : (
                          (data.recentPrescriptions ?? []).map((rx) => (
                            <tr
                              key={rx._id}
                              className="border-b last:border-0 hover:bg-muted/30"
                            >
                              <td className="px-4 py-3 font-medium">
                                {rx.patientName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                {rx.symptoms}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary">
                                  {rx.medications?.length ?? 0} drug
                                  {rx.medications?.length !== 1 ? "s" : ""}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {rx.createdAt
                                  ? new Date(rx.createdAt).toLocaleDateString()
                                  : "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
