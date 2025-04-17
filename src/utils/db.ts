import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a new client instance
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch(console.error);

export { client };
