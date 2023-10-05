import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_DB_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function connectToMongoDB() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }
  
  // Close the MongoDB connection when the application exits
  process.on('SIGINT', () => {
    client.close();
    console.log('MongoDB connection closed');
    process.exit();
  });
  
  export default client;