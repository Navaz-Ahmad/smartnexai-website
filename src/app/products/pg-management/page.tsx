'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import Link from 'next/link';

// Define types for our data
type PG = {
  _id: string;
  name: string;
  address: string;
  ownerId: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
};

const AdminPGDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pgs, setPgs] = useState<PG[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [pgName, setPgName] = useState('');
  const [pgAddress, setPgAddress] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Function to fetch PGs, wrapped in useCallback for stability
  const fetchPgs = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/pgs?ownerId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch PGs.');
      const data = await response.json();
      setPgs(data.pgs);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchPgs(parsedUser._id); // Fetch PGs when user is loaded
    } else {
        setIsLoading(false);
    }
  }, [fetchPgs]);

  const handleAddPg = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to add a PG.' });
      return;
    }
    setMessage(null);

    try {
      const response = await fetch('/api/pgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pgName, address: pgAddress, ownerId: user._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create PG.');
      
      setMessage({ type: 'success', text: 'PG created successfully!' });
      setPgName('');
      setPgAddress('');
      fetchPgs(user._id); // Refresh the list of PGs
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>Loading Dashboard...</p></div>;
  }
  
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>Please log in to view your dashboard.</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-4xl font-bold" style={{ color: '#00c6ff' }}>PG Management Portal</h1>
                <p className="text-gray-400">Welcome, {user.name}</p>
            </div>
            <a href="/login" onClick={() => localStorage.removeItem('user')} className="bg-red-500 hover:bg-red-600 font-bold py-2 px-5 rounded-lg">Logout</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add PG Form */}
            <div className="lg:col-span-1">
                <div className="p-6 rounded-lg" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h2 className="text-2xl font-bold mb-5">Add a New PG</h2>
                    <form onSubmit={handleAddPg} className="space-y-4">
                        {/* Form inputs remain the same */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400">PG Name</label>
                            <input type="text" value={pgName} onChange={e => setPgName(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Address</label>
                            <textarea value={pgAddress} onChange={e => setPgAddress(e.target.value)} required rows={3} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md p-2" />
                        </div>
                        <button type="submit" className="w-full text-white font-semibold py-2 px-4 rounded-lg" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}>
                            Add PG
                        </button>
                        {message && (
                            <p className={`text-sm mt-3 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.text}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* List of PGs */}
            <div className="lg:col-span-2">
                 <div className="p-6 rounded-lg h-full" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h2 className="text-2xl font-bold mb-5">Your Registered PGs</h2>
                     {pgs.length > 0 ? (
                        <div className="space-y-4">
                            {pgs.map(pg => (
                                <div key={pg._id} className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-cyan-400">{pg.name}</h3>
                                        <p className="text-gray-400">{pg.address}</p>
                                    </div>
                                    <Link href={`/products/pg-management/${pg._id}`} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                        Manage
                                    </Link>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-gray-400">You have not added any PGs yet.</p>
                     )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPGDashboard;

