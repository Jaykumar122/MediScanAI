'use server';

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import clientPromise from '@/dbConfig/dbConfig';

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
    if (authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const db = await getDb();
    const usersCol = db.collection('users');

    const pharmacists = await usersCol
      .find(
        { role: 'pharmacist' },
        {
          projection: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobileNumber: 1,
            govId: 1,
            status: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ message: 'Pharmacists fetched successfully', data: pharmacists });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Admin pharmacy GET error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
