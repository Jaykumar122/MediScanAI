import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'doctor' | 'patient' | 'pharmacist' | 'admin';
  name?: string;
  specialization?: string;
  age?: number;
  bloodType?: string;
}

// Authenticate request and extract user from JWT token
export function authenticateRequest(req: NextRequest): AuthUser {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Middleware to require specific role
export function requireRole(allowedRoles: string[]) {
  return (user: AuthUser) => {
    if (!allowedRoles.includes(user.role)) {
      throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }
    return true;
  };
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
      specialization: user.specialization,
      age: user.age,
      bloodType: user.bloodType
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}