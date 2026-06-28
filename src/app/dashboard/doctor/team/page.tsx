"use client";

import { useEffect, useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";

type TeamMember = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
  specialization?: string;
  status?: string;
};

function initials(member: TeamMember) {
  return [member.firstName, member.lastName].filter(Boolean).map((v) => v![0]).join("").toUpperCase() || "MS";
}

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/dashboard/doctor/resources?type=team&search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load team");
        const json = await res.json();
        setItems(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Care Team</h1>
        <p className="text-muted-foreground">Doctors and pharmacists collaborating on patient care.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team Members</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading team...</p> : error ? <p className="text-red-600">{error}</p> : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((member) => (
                <Card key={member._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar><AvatarFallback>{initials(member)}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{[member.firstName, member.lastName].filter(Boolean).join(" ") || "Unnamed"}</h3>
                        <p className="truncate text-sm text-muted-foreground">{member.email || "No email"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{member.mobileNumber || "No phone"}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline">{member.role || "team"}</Badge>
                          {member.specialization && <Badge>{member.specialization}</Badge>}
                          <Badge variant={member.status === "inactive" ? "destructive" : "secondary"}>{member.status || "active"}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items.length === 0 && <p className="col-span-full py-8 text-center text-muted-foreground">No team members found.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </DoctorPageShell>
  );
}
