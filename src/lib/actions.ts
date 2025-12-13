'use server';

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { suggestMedications } from '@/ai/flows/medication-suggestion';
import { encrypt, decrypt } from './crypto';
import type { Prescription } from './definitions';
import { PrescriptionSchema } from './definitions';
import clientPromise from '@/dbConfig/dbConfig';

async function getDb() {
  const client = await clientPromise;
  return client.db('securerx');
}

const CreatePrescriptionInput = PrescriptionSchema.omit({
  _id: true,
  scanCount: true,
  createdAt: true,
});

export async function createPrescription(
  data: z.infer<typeof CreatePrescriptionInput>
) {
  try {
    const validatedData = CreatePrescriptionInput.parse(data);

    const db = await getDb();
    const collection = db.collection('prescriptions');

    const prescriptionToInsert = {
      ...validatedData,
      scanCount: 0,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(prescriptionToInsert);
    const prescriptionId = result.insertedId.toString();

    const tokenPayload = { prescriptionId };
    const token = await encrypt(tokenPayload);

    return { success: true, token };
  } catch (error) {
    console.error('Error creating prescription:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data.' };
    }
    return { success: false, error: 'Failed to create prescription.' };
  }
}

export async function getPrescription(token: string): Promise<{
  success: boolean;
  data?: Prescription;
  error?: string;
}> {
  try {
    const decrypted = await decrypt(token);
    if (!decrypted || typeof decrypted.prescriptionId !== 'string') {
      throw new Error('Invalid token payload');
    }

    const prescriptionId = decrypted.prescriptionId;

    const db = await getDb();
    const collection = db.collection('prescriptions');

    const prescription = await collection.findOne({
      _id: new ObjectId(prescriptionId),
    });

    if (!prescription) {
      return { success: false, error: 'Prescription not found.' };
    }

    // Check before incrementing
    if (prescription.scanCount >= prescription.maxScans) {
      return {
        success: false,
        error: `This QR code has reached its scan limit of ${prescription.maxScans}.`,
      };
    }

    await collection.updateOne(
      { _id: new ObjectId(prescriptionId) },
      { $inc: { scanCount: 1 } }
    );
    
    // Manually convert ObjectId to string for serialization
    const serializablePrescription = {
      ...prescription,
      _id: prescription._id.toString(),
    };

    return { success: true, data: serializablePrescription as Prescription };
  } catch (error) {
    console.error('Error getting prescription:', error);
    return { success: false, error: 'Invalid or expired QR code.' };
  }
}

export async function getMedicationSuggestions(data: { symptoms: string }) {
  if (!data.symptoms || data.symptoms.trim().length < 3) {
    return { medications: '' };
  }
  try {
    const result = await suggestMedications({ symptoms: data.symptoms });
    return result;
  } catch (error) {
    console.error('AI suggestion error:', error);
    return { medications: '' };
  }
}
