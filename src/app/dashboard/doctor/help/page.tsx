import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Mail, MessageCircle, ShieldCheck } from "lucide-react";

export default function HelpPage() {
  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Get Help</h1>
        <p className="text-muted-foreground">Support resources for doctor dashboard workflows.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Quick Start</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Create prescriptions, scan QR codes, and use the AI assistant from the sidebar.</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Support Chat</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Use the AI Assistant for report and image analysis questions.</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Contact</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Email support: <span className="font-medium">support@mediscanai.com</span></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Safety Notes</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><Badge variant="outline">Important</Badge> AI analysis is assistive only and should not replace clinical judgment.</p>
          <p>Always verify prescription details before sharing QR codes with patients or pharmacists.</p>
        </CardContent>
      </Card>
    </DoctorPageShell>
  );
}
