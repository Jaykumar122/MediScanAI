'use server';

import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error('JWT_SECRET must be defined in .env and be at least 32 characters long');
}

const secretKey = new TextEncoder().encode(secret);
const alg = 'HS256';

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:securerx:issuer')
    .setAudience('urn:securerx:audience')
    .setExpirationTime('30d')
    .sign(secretKey);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'urn:securerx:issuer',
      audience: 'urn:securerx:audience',
    });
    return payload;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
