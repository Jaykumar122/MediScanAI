'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const teamMembers = [
  { id: 1, name: 'Sarah Connor', role: 'Sales Manager', email: 'sarah@example.com', leads: 45, conversions: 12, conversionRate: '26.7%', department: 'Sales' },
  { id: 2, name: 'John Reese', role: 'Account Executive', email: 'john@example.com', leads: 38, conversions: 9, conversionRate: '23.7%', department: 'Sales' },
  { id: 3, name: 'Emma Watson', role: 'Sales Rep', email: 'emma@example.com', leads: 32, conversions: 8, conversionRate: '25.0%', department: 'Sales' },
  { id: 4, name: 'Michael Scott', role: 'Regional Manager', email: 'michael@example.com', leads: 28, conversions: 7, conversionRate: '25.0%', department: 'Management' }
];

export default function TeamTab() {
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Track your team's progress and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Team Member</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Department</th>
                      <th className="text-left p-4 font-medium">Active Leads</th>
                      <th className="text-left p-4 font-medium">Conversions</th>
                      <th className="text-left p-4 font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{member.role}</td>
                        <td className="p-4">
                          <Badge variant="outline">{member.department}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{member.leads}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="default">{member.conversions}</Badge>
                        </td>
                        <td className="p-4 font-medium">{member.conversionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}