// src/lib/db.ts
import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientCache: { [uri: string]: Promise<MongoClient> };
}

if (!globalThis._mongoClientCache) {
  globalThis._mongoClientCache = {};
}

export async function connectToDatabase(uri: string): Promise<MongoClient> {
  if (!uri) {
    throw new Error('A MongoDB URI must be provided to the connectToDatabase function.');
  }

  // **THE FIX IS HERE:**
  // Instead of checking the value directly, we use the 'in' operator.
  // This explicitly checks if the 'uri' key *exists* in the cache object,
  // which is a check that TypeScript understands is valid and necessary.
  if (uri in globalThis._mongoClientCache) {
    return globalThis._mongoClientCache[uri];
  }

  const client = new MongoClient(uri);
  
  globalThis._mongoClientCache[uri] = client.connect();

  return globalThis._mongoClientCache[uri];
}