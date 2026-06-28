"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, CheckCircle2, XCircle, Clock } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UsersData {
  users: User[];
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

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

function StatusIcon({ status }: { status: string }) {
  if (status === "active")
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === "inactive")
    return <XCircle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-yellow-500" />;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UsersPage() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    const qs = params.toString();
    fetch(`/api/dashboard/admin/users${qs ? `?${qs}` : ""}`, {
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
        setError("Failed to load users");
        setLoading(false);
      });
  }, [search, roleFilter]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const id = setTimeout(fetchUsers, 300);
    return () => clearTimeout(id);
  }, [fetchUsers]);

  async function toggleStatus(user: User) {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setTogglingId(user._id);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/dashboard/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setData((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((u) =>
                u._id === user._id ? { ...u, status: newStatus } : u,
              ),
              active: prev.users.filter((u) =>
                u._id === user._id
                  ? newStatus === "active"
                  : u.status === "active",
              ).length,
              inactive: prev.users.filter((u) =>
                u._id === user._id
                  ? newStatus === "inactive"
                  : u.status === "inactive",
              ).length,
            }
          : prev,
      );
    } catch {
      // silently fail — user can retry
    } finally {
      setTogglingId(null);
    }
  }

  const displayedUsers = (data?.users ?? []).filter((u) => {
    if (statusFilter === "all") return true;
    return u.status === statusFilter;
  });

  const stats = [
    { label: "Total Users", value: data?.total ?? 0, color: "text-blue-600" },
    { label: "Active", value: data?.active ?? 0, color: "text-green-600" },
    { label: "Inactive", value: data?.inactive ?? 0, color: "text-red-600" },
    { label: "Pending", value: data?.pending ?? 0, color: "text-yellow-600" },
  ];

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
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className={`text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm bg-background"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
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
                          User
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
                        <th className="text-left px-4 py-3 font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-10 text-center text-muted-foreground"
                          >
                            No users found
                          </td>
                        </tr>
                      ) : (
                        displayedUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
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
                              <div className="flex items-center gap-1.5">
                                <StatusIcon status={user.status} />
                                <Badge
                                  variant="outline"
                                  className={
                                    statusColors[user.status?.toLowerCase()] ??
                                    "bg-gray-100 text-gray-700"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {user.status !== "pending" && (
                                <Button
                                  size="sm"
                                  variant={
                                    user.status === "active"
                                      ? "destructive"
                                      : "default"
                                  }
                                  onClick={() => toggleStatus(user)}
                                  disabled={togglingId === user._id}
                                  className="h-7 text-xs"
                                >
                                  {togglingId === user._id
                                    ? "Saving..."
                                    : user.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                </Button>
                              )}
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
