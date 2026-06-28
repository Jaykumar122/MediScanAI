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
    if (authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const db = await getDb();
    const drugsCol = db.collection('drugs');

    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ];
    }

    const drugs = await drugsCol.find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ message: 'Drugs fetched successfully', data: drugs });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Admin drugs GET error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, description, manufacturer, stock, unit, price, requiresPrescription } =
      body;

    if (!name || !category || !manufacturer || stock === undefined || !unit || price === undefined) {
      return NextResponse.json({ message: 'Missing required drug fields' }, { status: 400 });
    }

    const db = await getDb();
    const drugsCol = db.collection('drugs');

    const now = new Date();
    const stockNum = Number(stock);
    const newDrug = {
      name,
      category,
      description: description ?? '',
      manufacturer,
      stock: stockNum,
      unit,
      price: Number(price),
      requiresPrescription: Boolean(requiresPrescription),
      status: stockNum > 0 ? 'available' : 'out_of_stock',
      createdAt: now,
      updatedAt: now,
    };

    const result = await drugsCol.insertOne(newDrug);

    return NextResponse.json(
      { message: 'Drug created successfully', data: { _id: result.insertedId, ...newDrug } },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Admin drugs POST error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { drugId, ...fields } = body;

    if (!drugId) {
      return NextResponse.json({ message: 'drugId is required' }, { status: 400 });
    }

    // Prevent _id from being overwritten
    delete fields._id;

    const db = await getDb();
    const drugsCol = db.collection('drugs');

    const updateData: Record<string, any> = { ...fields, updatedAt: new Date() };

    if (fields.stock !== undefined) {
      updateData.stock = Number(fields.stock);
      // Auto-derive status from stock unless an explicit status was provided
      if (fields.status === undefined) {
        updateData.status = updateData.stock > 0 ? 'available' : 'out_of_stock';
      }
    }
    if (fields.price !== undefined) {
      updateData.price = Number(fields.price);
    }

    const result = await drugsCol.updateOne(
      { _id: new ObjectId(drugId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Drug updated successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Admin drugs PATCH error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Drug id query param is required' }, { status: 400 });
    }

    const db = await getDb();
    const drugsCol = db.collection('drugs');

    const result = await drugsCol.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Drug deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    console.error('Admin drugs DELETE error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
