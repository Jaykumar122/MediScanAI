"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar2";
import { SiteHeader } from "@/components/site-header2";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Drug {
  _id: string;
  name: string;
  category?: string;
  stock?: number;
  unit?: string;
  price?: number;
  requiresPrescription?: boolean;
  status?: string;
}

interface PharmacistInfo {
  firstName: string;
  lastName: string;
  email: string;
  govId: string;
}

interface Stats {
  totalDrugs: number;
  availableDrugs: number;
  lowStockDrugs: number;
}

interface DashboardData {
  pharmacistInfo: PharmacistInfo;
  stats: Stats;
  drugs: Drug[];
}

export default function PharmacistDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("/api/dashboard/pharmacist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then((json) => {
        setData(json.data ?? json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  function getStockBadge(drug: Drug) {
    const stock = drug.stock ?? 0;
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 10)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Low Stock
        </Badge>
      );
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        In Stock
      </Badge>
    );
  }

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
        <div className="flex flex-1 flex-col gap-6 p-6">
          {loading && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground animate-pulse">
                Loading dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-1 items-center justify-center">
              <Card className="max-w-md w-full">
                <CardContent className="pt-6">
                  <p className="text-destructive text-center">{error}</p>
                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Welcome Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Welcome, {data.pharmacistInfo.firstName}{" "}
                    {data.pharmacistInfo.lastName}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {data.pharmacistInfo.email}
                  </p>
                </div>
                <Badge className="text-sm px-3 py-1">Pharmacist</Badge>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Drugs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {data.stats.totalDrugs}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      {data.stats.availableDrugs}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Low Stock
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-600">
                      {data.stats.lowStockDrugs}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => router.push("/dashboard/pharmacist/scan")}
                  >
                    Scan Prescription QR
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/pharmacist/ai")}
                  >
                    AI Assistant
                  </Button>
                </CardContent>
              </Card>

              {/* Drugs Inventory Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Drug Inventory</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {data.drugs.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No drugs found in inventory.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Prescription</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.drugs.map((drug) => (
                          <TableRow key={drug._id}>
                            <TableCell className="font-medium">
                              {drug.name}
                            </TableCell>
                            <TableCell>{drug.category ?? "—"}</TableCell>
                            <TableCell>{drug.stock ?? 0}</TableCell>
                            <TableCell>{drug.unit ?? "—"}</TableCell>
                            <TableCell>
                              {drug.price != null ? `₹${drug.price}` : "—"}
                            </TableCell>
                            <TableCell>
                              {drug.requiresPrescription ? (
                                <Badge variant="secondary">Required</Badge>
                              ) : (
                                <Badge variant="outline">OTC</Badge>
                              )}
                            </TableCell>
                            <TableCell>{getStockBadge(drug)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
