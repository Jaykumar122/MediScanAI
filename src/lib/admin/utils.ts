import clientPromise from "@/dbConfig/dbConfig";
import { Db, Collection } from "mongodb";

/**
 * Get database instance
 * @returns MongoDB database instance
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("securerx");
}

/**
 * Get specific collection from the database
 * @param collectionName Name of the collection
 * @returns MongoDB collection
 */
export async function getCollection(
  collectionName: string,
): Promise<Collection> {
  const db = await getDb();
  return db.collection(collectionName);
}

/**
 * Log admin activity to the database
 * @param type Activity type
 * @param adminId Admin user ID
 * @param adminEmail Admin email
 * @param data Additional activity data
 */
export async function logAdminActivity(
  type: string,
  adminId: string,
  adminEmail: string,
  data?: Record<string, unknown>,
): Promise<void> {
  try {
    const activityCol = await getCollection("activity_logs");
    const activity: Record<string, unknown> = {
      type,
      data,
      adminId,
      adminEmail,
      timestamp: new Date(),
    };
    await activityCol.insertOne(activity);
  } catch (error) {
    console.error("Failed to log admin activity:", error);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Sanitize user object by removing sensitive fields
 * @param user User object
 * @returns Sanitized user object
 */
export function sanitizeUser(
  user: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!user) return null;

  const sanitized = { ...user };
  delete sanitized.password;
  delete sanitized.forgotPasswordToken;
  delete sanitized.forgotPasswordTokenExpiry;
  delete sanitized.verifyToken;
  delete sanitized.verifyTokenExpiry;

  return sanitized;
}

/**
 * Calculate pagination parameters
 * @param page Current page number (1-indexed)
 * @param pageSize Items per page
 * @returns Skip and limit values for database queries
 */
export function getPaginationParams(
  page: number = 1,
  pageSize: number = 10,
): { skip: number; limit: number } {
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  return {
    skip: (validPage - 1) * validPageSize,
    limit: validPageSize,
  };
}

/**
 * Format date range for analytics queries
 * @param range Range type ('today' | 'week' | 'month' | 'year' | custom)
 * @param customStart Custom start date (optional)
 * @param customEnd Custom end date (optional)
 * @returns Start and end dates
 */
export function getDateRange(
  range: "today" | "week" | "month" | "year" | "custom" = "month",
  customStart?: Date,
  customEnd?: Date,
): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date();
  let start: Date;

  switch (range) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      if (!customStart || !customEnd) {
        throw new Error("Custom date range requires both start and end dates");
      }
      start = customStart;
      end.setTime(customEnd.getTime());
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end };
}

/**
 * Validate email format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate user role
 * @param role Role to validate
 * @returns Boolean indicating if role is valid
 */
export function isValidRole(role: string): boolean {
  const validRoles = ["admin", "doctor", "patient", "pharmacist"];
  return validRoles.includes(role);
}

/**
 * Generate export filename with timestamp
 * @param prefix Filename prefix
 * @param extension File extension (default: 'csv')
 * @returns Formatted filename
 */
export function generateExportFilename(
  prefix: string,
  extension: string = "csv",
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Calculate percentage change between two values
 * @param current Current value
 * @param previous Previous value
 * @returns Percentage change (rounded to 2 decimals)
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

/**
 * Format number with thousand separators
 * @param num Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Truncate string to specified length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length (default: 50)
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
