'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,  
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    status: 'active',
    location: 'New York, USA',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    avatar: '',
    department: 'Engineering',
    projects: 12
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Manager',
    status: 'active',
    location: 'San Francisco, USA',
    joinDate: '2024-02-20',
    lastActive: '5 hours ago',
    avatar: '',
    department: 'Sales',
    projects: 8
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 (555) 345-6789',
    role: 'User',
    status: 'active',
    location: 'Los Angeles, USA',
    joinDate: '2024-03-10',
    lastActive: '1 day ago',
    avatar: '',
    department: 'Marketing',
    projects: 5
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1 (555) 456-7890',
    role: 'User',
    status: 'inactive',
    location: 'Chicago, USA',
    joinDate: '2024-04-05',
    lastActive: '3 days ago',
    avatar: '',
    department: 'Design',
    projects: 3
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    phone: '+1 (555) 567-8901',
    role: 'Manager',
    status: 'active',
    location: 'Boston, USA',
    joinDate: '2024-05-12',
    lastActive: '30 minutes ago',
    avatar: '',
    department: 'Operations',
    projects: 15
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    phone: '+1 (555) 678-9012',
    role: 'Admin',
    status: 'active',
    location: 'Seattle, USA',
    joinDate: '2024-01-08',
    lastActive: '1 hour ago',
    avatar: '',
    department: 'Engineering',
    projects: 20
  },
  {
    id: 7,
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    phone: '+1 (555) 789-0123',
    role: 'User',
    status: 'pending',
    location: 'Miami, USA',
    joinDate: '2024-09-25',
    lastActive: 'Never',
    avatar: '',
    department: 'Sales',
    projects: 0
  },
  {
    id: 8,
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@example.com',
    phone: '+1 (555) 890-1234',
    role: 'User',
    status: 'active',
    location: 'Austin, USA',
    joinDate: '2024-06-18',
    lastActive: '4 hours ago',
    avatar: '',
    department: 'Support',
    projects: 7
  }
];

const getRoleColor = (role: string) => {
  const roleMap: Record<string, string> = {
    'Admin': 'bg-purple-100 text-purple-800 border-purple-200',
    'Manager': 'bg-blue-100 text-blue-800 border-blue-200',
    'User': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return roleMap[role] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'inactive': 'bg-red-100 text-red-800 border-red-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { label: 'Total Users', value: users.length, color: 'text-blue-600' },
    { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
    { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length, color: 'text-red-600' },
    { label: 'Pending', value: users.filter(u => u.status === 'pending').length, color: 'text-yellow-600' }
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
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage your user accounts and permissions</CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Projects</th>
                  <th className="text-left p-4 font-medium">Last Active</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{user.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <span className="text-sm">{user.department}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <Badge variant="outline" className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant="secondary">{user.projects}</Badge>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{user.lastActive}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found matching your search criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}