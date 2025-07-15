import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";

const uri = process.env.MONGODB_URI;
const options = {
  tls: true,
  minDHSize: 1024,
};

const certPath = path.resolve(process.cwd(), "BaltimoreCyberTrustRoot.crt");
if (fs.existsSync(certPath)) {
  options.tlsCAFile = certPath;
}

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Test connection immediately
clientPromise
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

export async function connectToDatabase() {
  const client = await clientPromise;
  return { client, db: client.db(process.env.DB_NAME || 'newsletter') };
}

export default clientPromise;

// Database helper functions
export class DatabaseHelper {
  static async getDatabase() {
    const client = await clientPromise;
    return client.db("donation_platform");
  }

  // User registration
  static async saveUser(userData) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("users");

      // Check if user already exists
      const existingUser = await collection.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const result = await collection.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, id: result.insertedId };
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("users");

      const user = await collection.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Save donation
  static async saveDonation(donationData) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("donations");

      const result = await collection.insertOne({
        ...donationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, id: result.insertedId };
    } catch (error) {
      console.error("Error saving donation:", error);
      throw error;
    }
  }

  // Update project amount
  static async updateProjectAmount(projectId, amount) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("projects");

      const result = await collection.updateOne(
        { _id: projectId },
        {
          $inc: {
            raisedAmount: amount,
            donationCount: 1,
          },
          $set: { updatedAt: new Date() },
        }
      );

      return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
      console.error("Error updating project amount:", error);
      throw error;
    }
  }

  // Add to DatabaseHelper class
  static async saveCampaign(campaignData) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("campaigns");

      const result = await collection.insertOne({
        ...campaignData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, id: result.insertedId };
    } catch (error) {
      console.error("Error saving campaign:", error);
      throw error;
    }
  }

  // Get donations by project
  static async getDonationsByProject(projectId) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("donations");

      const donations = await collection
        .find({ projectId, status: "success" })
        .sort({ createdAt: -1 })
        .toArray();

      return donations;
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  }

  // Get donations by email
  static async getDonationsByEmail(email) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection("donations");

      const donations = await collection
        .find({ email, status: "success" })
        .sort({ createdAt: -1 })
        .toArray();

      return donations;
    } catch (error) {
      console.error("Error fetching user donations:", error);
      throw error;
    }
  }
}