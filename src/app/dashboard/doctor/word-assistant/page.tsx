"use client";

import { useState } from "react";
import { DoctorPageShell } from "@/components/doctor/doctor-page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Wand2 } from "lucide-react";

export default function WordAssistantPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    const cleaned = notes.trim();
    if (!cleaned) {
      setOutput("Enter clinical notes to format them into a report.");
      return;
    }
    setOutput(`Clinical Summary\n\n${cleaned}\n\nAssessment\n- Review patient symptoms and clinical findings.\n\nPlan\n- Confirm diagnosis and prescribe treatment as clinically appropriate.\n- Share prescription QR only after verification.`);
  };

  return (
    <DoctorPageShell>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Word Assistant</h1>
        <p className="text-muted-foreground">Draft structured clinical notes and reports.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5" /> Notes Input</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste rough clinical notes here..." className="min-h-72" />
            <Button onClick={format}>Format Notes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Draft Output</CardTitle></CardHeader>
          <CardContent><pre className="min-h-72 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">{output || "Formatted report will appear here."}</pre></CardContent>
        </Card>
      </div>
    </DoctorPageShell>
  );
}
