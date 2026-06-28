import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "@/lib/auth/db";
import type { User } from "@/lib/definitions";

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  role: User["role"];
  govId?: string;
  password?: string;
  age?: number;
  bloodType?: string;
  specialization?: string;
  provider?: "local" | "google" | "github" | "apple";
  googleId?: string;
  githubId?: string;
  appleId?: string;
  profilePicture?: string | null;
};

export function sanitizeUser<
  T extends Partial<User> & { _id?: ObjectId | string },
>(user: T) {
  const safeUser = { ...user } as Partial<User> & { _id?: ObjectId | string };
  delete safeUser.password;

  return {
    ...safeUser,
    _id: safeUser._id ? String(safeUser._id) : undefined,
  };
}

export async function createLocalUser(input: CreateUserInput) {
  const users = await getUsersCollection();
  const hashedPassword = await bcrypt.hash(input.password!, 10);

  const newUser: Omit<User, "_id"> & {
    provider?: "local" | "google" | "github" | "apple";
    profilePicture?: string | null;
    googleId?: string;
    githubId?: string;
    appleId?: string;
  } = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    mobileNumber: input.mobileNumber,
    govId: input.govId,
    password: hashedPassword,
    role: input.role,
    status: "active",
    createdAt: new Date(),
    ...(input.role === "patient" && {
      age: input.age,
      bloodType: input.bloodType,
    }),
    ...(input.role === "doctor" && { specialization: input.specialization }),
    provider: "local",
    profilePicture: input.profilePicture ?? null,
  };

  const result = await users.insertOne(newUser as User);
  return sanitizeUser({ ...newUser, _id: result.insertedId });
}

export async function findUserByEmail(email: string) {
  const users = await getUsersCollection();
  return users.findOne({ email: email.toLowerCase() });
}

export async function findOrCreateOAuthUser(input: {
  provider: "google" | "github" | "apple";
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}) {
  const users = await getUsersCollection();
  const providerField = `${input.provider}Id` as
    "googleId" | "githubId" | "appleId";

  let user = await users.findOne({
    [providerField]: input.providerId,
  } as Partial<User>);

  if (!user && input.email) {
    user = await users.findOne({ email: input.email.toLowerCase() });
  }

  if (user) {
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          [providerField]: input.providerId,
          provider: input.provider,
          profilePicture: input.profilePicture ?? null,
          email: input.email.toLowerCase(),
          firstName: user.firstName || input.firstName,
          lastName: user.lastName || input.lastName,
        },
      },
    );

    const updated = await users.findOne({ _id: user._id });
    return sanitizeUser(updated!);
  }

  const generatedPassword = await bcrypt.hash(
    `${input.provider}-${input.providerId}`,
    10,
  );
  const newUser = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    password: generatedPassword,
    role: undefined, // Role will be set during role selection
    status: "pending" as const, // Set to pending until role is selected
    createdAt: new Date(),
    provider: input.provider,
    profilePicture: input.profilePicture ?? null,
    [providerField]: input.providerId,
  };

  const result = await users.insertOne(newUser as any);
  return sanitizeUser({ ...newUser, _id: result.insertedId });
}
