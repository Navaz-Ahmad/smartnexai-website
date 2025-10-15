// This script is for one-time use to add the superadmin to the database.
// Run it from your terminal using: node scripts/seed-superadmin.js

require('dotenv').config({ path: './.env.local' }); // Load environment variables
const { MongoClient } = require('mongodb');
const { hash } = require('bcryptjs');

// --- ⚠️ IMPORTANT: Change these details to your desired credentials ---
const superAdminDetails = {
  name: "Super Admin",
  email: "superadmin@smartnexai.com",
  password: "1234", // Use a strong, unique password
};
// --------------------------------------------------------------------

async function seedSuperAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI not found in .env.local file.');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    const db = client.db("smartnexai_db");
    const usersCollection = db.collection("users");

    // Check if the superadmin already exists
    const existingAdmin = await usersCollection.findOne({ email: superAdminDetails.email });
    if (existingAdmin) {
      console.log("Super admin with this email already exists. Aborting.");
      return;
    }

    // Hash the password securely
    console.log("Hashing password...");
    const hashedPassword = await hash(superAdminDetails.password, 12);

    // Create the superadmin user document
    const superAdminUser = {
      name: superAdminDetails.name,
      email: superAdminDetails.email,
      password: hashedPassword,
      role: "superadmin",
      assignedProducts: [], // Superadmin has access to all products by default
      createdAt: new Date(),
    };

    // Insert the user into the database
    console.log("Inserting super admin into the database...");
    const result = await usersCollection.insertOne(superAdminUser);
    
    // Ensure the unique index on email exists for future performance
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    console.log("✅ Success! Super admin created successfully.");
    console.log(`Inserted with document ID: ${result.insertedId}`);

  } catch (error) {
    console.error("❌ An error occurred during the seeding process:", error);
  } finally {
    console.log("Closing database connection.");
    await client.close();
  }
}

seedSuperAdmin();
