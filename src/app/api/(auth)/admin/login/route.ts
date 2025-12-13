'use server';

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/crypto';
import type { User } from '@/lib/definitions';

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = 'securerx';
const USERS_COLLECTION = 'users';

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function getDb() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db(DB_NAME);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    const user = await usersCollection.findOne({ email: email.toLowerCase(), role: 'admin' });

    if (!user) {
      return NextResponse.json({ message: 'Admin account not found or you are not an admin.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials provided.' }, { status: 401 });
    }
    
    const tokenPayload = {
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    };
    const token = await encrypt(tokenPayload);

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
