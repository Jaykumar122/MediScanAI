import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Pill, Users } from "lucide-react";

const libraries = [
  { title: "Prescription Records", description: "Doctor-created prescriptions and QR scan limits.", icon: FileText, href: "/dashboard/doctor/prescriptions" },
  { title: "Drug Inventory", description: "Available medicines from pharmacy inventory.", icon: Pill, href: "/dashboard/doctor/drugs" },
  { title: "Care Team", description: "Doctors and pharmacists registered in the system.", icon: Users, href: "/dashboard/doctor/team" },
];

export default function DataLibraryPage() {
  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Data Library</h1>
        <p className="text-muted-foreground">Central access to clinical data resources.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {libraries.map((item) => {
          const Icon = item.icon;
          return (
            <a href={item.href} key={item.title}>
              <Card className="h-full transition hover:shadow-md">
                <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5" /> {item.title}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{item.description}</p><Badge className="mt-4" variant="outline">Open</Badge></CardContent>
              </Card>
            </a>
          );
        })}
      </div>
      <Card><CardContent className="flex items-center gap-3 pt-6"><Database className="h-5 w-5 text-blue-600" /><p className="text-sm text-muted-foreground">Data is loaded from MongoDB-backed dashboard APIs.</p></CardContent></Card>
    </DoctorPageShell>
  );
}
