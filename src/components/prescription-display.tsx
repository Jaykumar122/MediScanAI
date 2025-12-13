import type { Prescription } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from './ui/separator';
import { User, Pill, Stethoscope, Calendar, ScanLine, Package } from 'lucide-react';

type PrescriptionDisplayProps = {
  prescription: Prescription;
};

export default function PrescriptionDisplay({
  prescription,
}: PrescriptionDisplayProps) {
  const scanCount = (prescription.scanCount ?? 0) + 1;
  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <span>Prescription Details</span>
        </CardTitle>
        <CardDescription>
          Scanned on: {new Date().toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 text-sm">
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <p className="font-medium text-muted-foreground">Patient</p>
            <p className="font-semibold text-lg">{prescription.patientName}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Age</p>
            <p className="font-semibold text-lg">{prescription.patientAge}</p>
          </div>
        </div>

        <div className="space-y-2">
            <p className="font-medium text-muted-foreground flex items-center gap-2"><Stethoscope className="h-4 w-4"/>Symptoms</p>
            <p className="rounded-lg border p-4 bg-background">{prescription.symptoms}</p>
        </div>
        
        <Separator />

        <div>
          <h3 className="font-medium text-muted-foreground mb-4 flex items-center gap-2"><Pill className="h-4 w-4"/>Medications</h3>
          <div className="space-y-4">
            {prescription.medications.map((med, index) => (
              <div key={index} className="rounded-lg border p-4">
                <p className="font-semibold">{med.name}</p>
                <div className="flex justify-between text-muted-foreground mt-1">
                  <span>{med.dosage}</span>
                  <span>{med.frequency}</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground mt-2 border-t pt-2">
                    <Package className="h-4 w-4"/>
                    <span>Quantity: {med.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                    Issued: {new Date(prescription.createdAt!).toLocaleDateString()}
                </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
                <ScanLine className="h-4 w-4" />
                <span>
                    Scanned: {scanCount} of {prescription.maxScans} times
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
