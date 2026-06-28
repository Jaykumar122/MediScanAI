"use client";

import { CSSProperties, useEffect, useState, FormEvent } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  PlusCircle,
  X,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface Drug {
  _id: string;
  name: string;
  category: string;
  manufacturer?: string;
  stock: number;
  unit?: string;
  price?: number;
  requiresPrescription: boolean;
  status: string;
}

interface DrugsData {
  drugs: Drug[];
  total: number;
  available: number;
  outOfStock: number;
  lowStock: number;
}

const CATEGORIES = [
  "Antibiotics",
  "Analgesics",
  "Antidiabetics",
  "Antihypertensives",
  "Vitamins",
  "Other",
];
const UNITS = ["Tablets", "Capsules", "Syrup", "Injection", "Cream", "Other"];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  available: "bg-green-100 text-green-800 border-green-200",
  "out of stock": "bg-red-100 text-red-800 border-red-200",
  out_of_stock: "bg-red-100 text-red-800 border-red-200",
  "low stock": "bg-yellow-100 text-yellow-800 border-yellow-200",
  low_stock: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const defaultForm = {
  name: "",
  category: "Other",
  manufacturer: "",
  stock: "",
  unit: "Tablets",
  price: "",
  requiresPrescription: false,
};

export default function DrugsPage() {
  const [data, setData] = useState<DrugsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function fetchDrugs() {
    const token = localStorage.getItem("authToken");
    fetch("/api/dashboard/admin/drugs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        const payload = d.data ?? d;
        if (Array.isArray(payload)) {
          // API returned bare array
          setData({
            drugs: payload,
            total: payload.length,
            available: payload.filter((x: Drug) => x.stock > 10).length,
            outOfStock: payload.filter((x: Drug) => x.stock === 0).length,
            lowStock: payload.filter((x: Drug) => x.stock > 0 && x.stock < 10)
              .length,
          });
        } else {
          setData(payload);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load drugs");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchDrugs();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Drug name is required");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/dashboard/admin/drugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock) || 0,
          price: Number(form.price) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to add drug");
      }
      setForm(defaultForm);
      setShowForm(false);
      fetchDrugs();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to add drug");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = (data?.drugs ?? []).filter((d) => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const stats = [
    {
      label: "Total Drugs",
      value: data?.total ?? 0,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Available",
      value: data?.available ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Out of Stock",
      value: data?.outOfStock ?? 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Low Stock (<10)",
      value: data?.lowStock ?? 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

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
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label}>
                <CardContent className="flex flex-col gap-2 pt-5">
                  <div
                    className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Drug Inline Form */}
          {showForm && (
            <Card className="border-primary/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Add New Drug</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowForm(false);
                      setFormError(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      placeholder="e.g. Amoxicillin"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Manufacturer</label>
                    <Input
                      placeholder="e.g. Pfizer"
                      value={form.manufacturer}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, manufacturer: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Stock</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.stock}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, stock: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Unit</label>
                    <select
                      value={form.unit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, unit: e.target.value }))
                      }
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                    <input
                      type="checkbox"
                      id="requiresPrescription"
                      checked={form.requiresPrescription}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          requiresPrescription: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="requiresPrescription"
                      className="text-sm font-medium"
                    >
                      Requires Prescription
                    </label>
                  </div>

                  {formError && (
                    <p className="text-sm text-destructive sm:col-span-2 lg:col-span-3">
                      {formError}
                    </p>
                  )}

                  <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Adding..." : "Add Drug"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setForm(defaultForm);
                        setFormError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Drugs Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Drugs & Medicines</CardTitle>
                  <CardDescription>Manage your drug inventory</CardDescription>
                </div>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Drug
                  </Button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by drug name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                          Category
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Manufacturer
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Stock
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Price
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Prescription
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                          Status
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
                            No drugs found
                          </td>
                        </tr>
                      ) : (
                        filtered.map((drug) => (
                          <tr
                            key={drug._id}
                            className="border-b last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-4 py-3 font-medium">
                              {drug.name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {drug.category}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {drug.manufacturer ?? "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  drug.stock === 0
                                    ? "text-red-600 font-medium"
                                    : drug.stock < 10
                                      ? "text-yellow-600 font-medium"
                                      : ""
                                }
                              >
                                {drug.stock}
                              </span>
                              {drug.unit && (
                                <span className="text-muted-foreground ml-1 text-xs">
                                  {drug.unit}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {drug.price !== undefined && drug.price !== null
                                ? `$${Number(drug.price).toFixed(2)}`
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  drug.requiresPrescription
                                    ? "bg-rose-100 text-rose-800 border-rose-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                              >
                                {drug.requiresPrescription ? "Yes" : "No"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[drug.status?.toLowerCase()] ??
                                  "bg-gray-100 text-gray-700"
                                }
                              >
                                {drug.status?.replaceAll("_", " ")}
                              </Badge>
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
