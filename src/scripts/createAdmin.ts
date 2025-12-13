import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = 'securerx';
const USERS_COLLECTION = 'users';

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in your .env file');
}

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run create-admin <email> <password>');
    process.exit(1);
  }
  
  if(password.length < 8) {
    console.error('Password must be at least 8 characters long.');
    process.exit(1);
  }

  let client: MongoClient | undefined;

  try {
    console.log('Connecting to database...');
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(USERS_COLLECTION);
    
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const existingAdmin = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.error(`Error: Admin with email "${email}" already exists.`);
      process.exit(1);
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating admin user...');
    const result = await usersCollection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log(`Successfully created admin user with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed.');
    }
  }
}

createAdmin();
