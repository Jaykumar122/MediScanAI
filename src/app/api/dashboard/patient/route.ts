'use server';

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import type { User, Prescription } from '@/lib/definitions';
import clientPromise from '@/dbConfig/dbConfig';
import { ObjectId } from 'mongodb';

const USERS_COLLECTION = 'users';
const PRESCRIPTIONS_COLLECTION = 'prescriptions';

async function getDb() {
  const client = await clientPromise;
  return client.db('securerx');
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const decryptedPayload = await decrypt(token);

    if (!decryptedPayload || !decryptedPayload.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const userId = decryptedPayload.userId as string;

    const db = await getDb();
    const usersCollection = db.collection<User>(USERS_COLLECTION);
    
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    // Fetch prescriptions for the patient
    const prescriptionsCollection = db.collection<Prescription>(PRESCRIPTIONS_COLLECTION);
    const prescriptions = await prescriptionsCollection.find({ patientId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();

    // This is mock data. In a real application, you would fetch this from respective collections.
    const mockData = {
        appointments: [
            { 
              id: '1', 
              doctor: 'Dr. Sarah Wilson', 
              specialty: 'Cardiologist', 
              date: '2024-10-02T10:00:00Z', 
              time: '10:00 AM', 
              type: 'Follow-up', 
              status: 'upcoming' as const,
              location: 'Room 205, Cardiology Wing'
            },
            { 
              id: '2', 
              doctor: 'Dr. Michael Chen', 
              specialty: 'General Practice', 
              date: '2024-10-15T14:30:00Z', 
              time: '02:30 PM', 
              type: 'Annual Check-up', 
              status: 'upcoming' as const,
              location: 'Room 101, Main Building'
            },
        ],
        medications: [
            { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', refillsLeft: 2, status: 'active' as const },
            { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', refillsLeft: 1, status: 'active' as const },
        ],
        testResults: [
            { id: '1', test: 'Complete Blood Count', date: '2024-09-18', result: 'Normal', status: 'normal' as const, doctor: 'Dr. Sarah Wilson' },
            { id: '2', test: 'Cholesterol Panel', date: '2024-09-18', result: 'Slightly Elevated', status: 'abnormal' as const, doctor: 'Dr. Sarah Wilson' },
            { id: '3', test: 'Blood Glucose', date: '2024-09-15', result: 'Pending', status: 'pending' as const, doctor: 'Dr. Michael Chen' },
        ],
        vitalSigns: {
            bloodPressure: '120/80',
            heartRate: '72',
            temperature: '98.6°F',
            weight: '165 lbs',
            lastUpdated: '2024-09-25'
        }
    }

    const { password, ...patientInfo } = user;

    const serializablePrescriptions = prescriptions.map(p => ({
        ...p,
        _id: p._id.toString(),
        patientId: p.patientId.toString(),
        createdAt: p.createdAt.toISOString(),
    }));

    const dashboardData = {
        patientInfo,
        prescriptions: serializablePrescriptions,
        ...mockData
    }

    return NextResponse.json({
      message: 'Dashboard data fetched successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
