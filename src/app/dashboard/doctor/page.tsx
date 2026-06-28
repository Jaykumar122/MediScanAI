"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar1";
import { SiteHeader } from "@/components/site-header1";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  FileText,
  Calendar,
  Activity,
  Plus,
  QrCode,
  Bot,
  AlertCircle,
} from "lucide-react";

interface DoctorInfo {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
}

interface Prescription {
  id: string;
  patientName: string;
  symptoms: string;
  medications: unknown[];
  maxScans: number;
  scanCount: number;
  date: string;
}

interface DashboardStats {
  totalPrescriptions: number;
  prescriptionsThisMonth: number;
  activePrescriptions: number;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPrescriptions: 0,
    prescriptionsThisMonth: 0,
    activePrescriptions: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/dashboard/doctor", {
          headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        const payload = json.data || json;
        setDoctorInfo(payload.doctorInfo);
        setPrescriptions(payload.prescriptions || []);
        setStats(
          payload.stats || {
            totalPrescriptions: 0,
            prescriptionsThisMonth: 0,
            activePrescriptions: 0,
          },
        );
      } catch {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {doctorInfo?.email}
            </p>
          </div>
          {doctorInfo?.specialization && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
              {doctorInfo.specialization}
            </span>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Prescriptions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalPrescriptions}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.prescriptionsThisMonth}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Prescriptions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.activePrescriptions}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Prescriptions + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Prescriptions Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Prescriptions
              </h2>
            </div>
            <div className="p-6">
              {prescriptions.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No prescriptions yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-3 font-medium">Patient</th>
                        <th className="pb-3 font-medium">Symptoms</th>
                        <th className="pb-3 font-medium">Meds</th>
                        <th className="pb-3 font-medium">Scans</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {prescriptions.map((rx) => (
                        <tr
                          key={
                            rx.id ||
                            (rx as unknown as { _id?: string })._id ||
                            rx.patientName
                          }
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="py-3 font-medium text-gray-900 dark:text-white">
                            {rx.patientName}
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-300 max-w-[160px] truncate">
                            {rx.symptoms}
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">
                            {Array.isArray(rx.medications)
                              ? rx.medications.length
                              : 0}
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">
                            {rx.scanCount}/{rx.maxScans}
                          </td>
                          <td className="py-3 text-gray-500 dark:text-gray-400">
                            {rx.date ||
                            (rx as unknown as { createdAt?: string }).createdAt
                              ? new Date(
                                  rx.date ||
                                    (rx as unknown as { createdAt?: string })
                                      .createdAt ||
                                    "",
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => router.push("/dashboard/doctor/prescriptions")}
                className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors text-left"
              >
                <div className="bg-blue-600 p-2 rounded-lg shrink-0">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    New Prescription
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Create a prescription
                  </p>
                </div>
              </button>

              <button
                onClick={() => router.push("/dashboard/doctor/scan")}
                className="w-full flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl transition-colors text-left"
              >
                <div className="bg-green-600 p-2 rounded-lg shrink-0">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Scan QR
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Scan patient QR code
                  </p>
                </div>
              </button>

              <button
                onClick={() => router.push("/dashboard/doctor/ai")}
                className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl transition-colors text-left"
              >
                <div className="bg-purple-600 p-2 rounded-lg shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    AI Assistant
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get AI-powered insights
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
