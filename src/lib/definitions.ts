import { z } from 'zod';

export const MedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  frequency: z.string().min(1, 'Frequency is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
});

export const PrescriptionSchema = z.object({
  _id: z.string().optional(),
  patientName: z.string().min(1, 'Patient name is required.'),
  patientAge: z.coerce.number().min(0, 'Age must be a positive number.'),
  symptoms: z.string().min(1, 'Symptoms are required.'),
  medications: z.array(MedicationSchema).min(1, 'At least one medication is required.'),
  scanCount: z.number().optional(),
  maxScans: z.coerce.number().min(1, 'Scan limit is required.').default(5),
  createdAt: z.date().optional(),
});

export const UserSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  mobileNumber: z.string().optional(),
  govId: z.string().optional(),
  password: z.string(),
  role: z.enum(['admin', 'doctor', 'patient', 'pharmacist']),
  age: z.number().optional(),
  bloodType: z.string().optional(),
  specialization: z.string().optional(),
  createdAt: z.date().optional(),
  status: z.enum(['pending', 'active']).default('active'),
});

export type Medication = z.infer<typeof MedicationSchema>;
export type Prescription = z.infer<typeof PrescriptionSchema>;
export type User = z.infer<typeof UserSchema>;
