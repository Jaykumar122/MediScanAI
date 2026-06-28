'use server';

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import clientPromise from '@/dbConfig/dbConfig';
import { ObjectId } from 'mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db('securerx');
}

async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');
  const token = authHeader.split(' ')[1];
  const payload = await decrypt(token);
  if (!payload?.userId) throw new Error('Invalid token');
  return payload as { userId: string; email: string; role: string };
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== 'doctor') {
      return NextResponse.json({ message: 'Forbidden: Doctor access required' }, { status: 403 });
    }

    const db = await getDb();
    const usersCol = db.collection('users');
    const prescriptionsCol = db.collection('prescriptions');

    const doctor = await usersCol.findOne(
      { _id: new ObjectId(authUser.userId) },
      { projection: { firstName: 1, lastName: 1, email: 1, specialization: 1 } }
    );

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const prescriptions = await prescriptionsCol
      .find({ doctorId: new ObjectId(authUser.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalPrescriptions = prescriptions.length;
    const prescriptionsThisMonth = prescriptions.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= startOfMonth
    ).length;
    // Active = still has scans remaining
    const activePrescriptions = prescriptions.filter(
      (p) => p.scanCount !== undefined && p.maxScans !== undefined && p.scanCount < p.maxScans
    ).length;

    return NextResponse.json({
      message: 'Doctor dashboard data fetched successfully',
      data: {
        doctorInfo: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          specialization: doctor.specialization,
        },
        prescriptions,
        stats: {
          totalPrescriptions,
          prescriptionsThisMonth,
          activePrescriptions,
        },
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Doctor dashboard error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
