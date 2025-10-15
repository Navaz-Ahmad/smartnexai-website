// This script is for one-time use to add the products to the database.
// Run it from your terminal using: node scripts/seed-products.js

require('dotenv').config({ path: './.env.local' }); // Load environment variables
const { MongoClient } = require('mongodb');

// --- The list of products to add ---
const productsToAdd = [
  {
    productName: "College Management System",
    productKey: "college-management",
    description: "A full suite for managing all college operations, from admissions to alumni.",
    accessUrl: "/dashboard/college-management",
    isActive: true
  },
  {
    productName: "Mess Management",
    productKey: "mess-management",
    description: "Manages daily mess attendance, billing, inventory, and menus.",
    accessUrl: "/dashboard/mess-management",
    isActive: true
  },
  {
    productName: "PG Management",
    productKey: "pg-management",
    description: "Handles tenant onboarding, rent collection, complaints, and room allocation.",
    accessUrl: "/dashboard/pg-management",
    isActive: true
  }
];
// --------------------------------------------------------------------

async function seedProducts() {
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
    const productsCollection = db.collection("products");

    console.log("Checking for existing products...");
    let newProducts = [];
    for (const product of productsToAdd) {
        const existingProduct = await productsCollection.findOne({ productKey: product.productKey });
        if (!existingProduct) {
            newProducts.push({
                ...product,
                createdAt: new Date()
            });
        } else {
            console.log(`Product "${product.productName}" already exists. Skipping.`);
        }
    }

    if (newProducts.length > 0) {
        console.log(`Found ${newProducts.length} new products to insert.`);
        console.log("Inserting new products into the database...");
        const result = await productsCollection.insertMany(newProducts);
        
        // Ensure a unique index on productKey for future performance and data integrity
        await productsCollection.createIndex({ productKey: 1 }, { unique: true });

        console.log("✅ Success! New products added successfully.");
        console.log(`Inserted ${result.insertedCount} documents.`);
    } else {
        console.log("✅ All products are already in the database. No action needed.");
    }

  } catch (error) {
    console.error("❌ An error occurred during the product seeding process:", error);
  } finally {
    console.log("Closing database connection.");
    await client.close();
  }
}

seedProducts();
