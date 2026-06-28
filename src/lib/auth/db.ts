import clientPromise from "@/dbConfig/dbConfig";
import { AUTH_DB_NAME, AUTH_USERS_COLLECTION } from "@/lib/auth/config";
import type { User } from "@/lib/definitions";

export async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(AUTH_DB_NAME);
  return db.collection<User>(AUTH_USERS_COLLECTION);
}
