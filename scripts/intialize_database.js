// This script initializes your module-specific databases by performing a single write operation.
// Run it from your terminal using: node scripts/initialize-databases.js

const path = require('path');
// Make the path to .env.local robust, so it can be run from any directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { MongoClient } = require('mongodb');

// Array of environment variable keys for your module databases
const dbUris = [
  process.env.MONGODB_URI_PG,
  process.env.MONGODB_URI_MESS,
  process.env.MONGODB_URI_COLLEGE,
];

// A function to extract the database name from the connection string for logging
function getDbNameFromUri(uri) {
  try {
    const dbName = new URL(uri).pathname.substring(1);
    return dbName || 'database'; // Fallback name
  } catch (e) {
    return 'database';
  }
}

async function initializeDatabases() {
  console.log('🚀 Starting database initialization process...\n');
  
  // Use Promise.all to run the initialization for all databases concurrently
  await Promise.all(dbUris.map(async (uri) => {
    if (!uri) {
      console.warn('⚠️ A database URI is missing in your .env.local file. Skipping.\n');
      return;
    }

    const dbName = getDbNameFromUri(uri);
    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log(`🔗 Connected to "${dbName}"`);
      const db = client.db(); // Gets the default database from the URI

      // A placeholder collection to trigger database creation.
      const initCollection = db.collection('_initialization');
      
      // Use findOneAndUpdate with upsert:true. This is a safe, idempotent operation.
      await initCollection.findOneAndUpdate(
        { initialized: true },
        { $set: { lastChecked: new Date() } },
        { upsert: true }
      );

      console.log(`✅ Success: Database "${dbName}" is ready.`);
    } catch (error) {
      console.error(`❌ Error initializing "${dbName}":`, error);
    } finally {
      await client.close();
      console.log(`🔒 Connection to "${dbName}" closed\n`);
    }
  }));

  console.log('🎉 Database initialization process complete.');
}

// Run the async function
initializeDatabases().catch(err => console.error('❌ Fatal error:', err));

