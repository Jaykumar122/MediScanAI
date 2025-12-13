'use server';

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/definitions';
import { encrypt } from '@/lib/crypto';


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
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      role,
      govId,
      password,
      age,
      bloodType,
      specialization
    } = body;

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: Omit<User, '_id'> = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobileNumber,
      govId,
      password: hashedPassword,
      role,
      status: 'active',
      createdAt: new Date(),
      ...(role === 'patient' && { age, bloodType }),
      ...(role === 'doctor' && { specialization }),
    };

    const result = await usersCollection.insertOne(newUser as User);
    const insertedUser = { ...newUser, _id: result.insertedId.toString() };

    const tokenPayload = {
      userId: insertedUser._id,
      email: insertedUser.email,
      role: insertedUser.role,
    };
    const token = await encrypt(tokenPayload);

    const { password: _, ...userWithoutPassword } = insertedUser;

    return NextResponse.json({
        message: 'Account created successfully!',
        token,
        user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
