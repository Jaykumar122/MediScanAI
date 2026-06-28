"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconFileAi,
  IconCamera,
  IconDatabase,
  IconEmergencyBed,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconMedicalCross,
  IconPrescription,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user1";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Doctor",
    email: "doctor@mediscanai.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Doctor Dashboard",
      url: "/dashboard/doctor",
      icon: IconListDetails,
    },
    {
      title: "Prescriptions",
      url: "/dashboard/doctor/prescriptions",
      icon: IconPrescription,
    },
    {
      title: "Scan QR Code",
      url: "/dashboard/doctor/scan",
      icon: IconCamera,
    },
    {
      title: "Doctors",
      url: "/dashboard/doctor/doctors",
      icon: IconMedicalCross,
    },
    {
      title: "Pharmacy",
      url: "/dashboard/doctor/pharmacy",
      icon: IconEmergencyBed,
    },
    {
      title: "Team",
      url: "/dashboard/doctor/team",
      icon: IconUsers,
    },
    {
      title: "Drugs",
      url: "/dashboard/doctor/drugs",
      icon: IconListDetails,
    },
    {
      title: "AI Assistant",
      url: "/dashboard/doctor/ai",
      icon: IconFileAi,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/doctor/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/dashboard/doctor/help",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboard/doctor/data-library",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/dashboard/doctor/reports",
      icon: IconReport,
    },
    {
      name: "Work Assistant",
      url: "/dashboard/doctor/work-assistant",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard/doctor">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">MediScan AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
