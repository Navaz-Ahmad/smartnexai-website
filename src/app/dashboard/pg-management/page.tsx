'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

// Define types for better code safety
type Admin = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

type Message = {
  type: 'success' | 'error';
  text: string;
};

const PGManagementDashboard = () => {
  // State for the form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // State for feedback and data
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  // Fetch existing admins when the component loads
  useEffect(() => {
    fetchProductAdmins();
  }, []);

  const fetchProductAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admins/pg-management');
      const data = await response.json();

      if (response.ok) {
        setAdmins(data.admins);
      } else {
        throw new Error(data.message || 'Failed to fetch admins');
      }
    } catch (error: unknown) {
      // Narrow unknown type
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission to create a new admin
  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, productKey: 'pg-management' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin created successfully!' });
        // Reset form and refresh the list
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        fetchProductAdmins();
      } else {
        throw new Error(data.message || 'Failed to create admin');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard">
          <span className="text-cyan-400 hover:text-cyan-300 transition-colors mb-8 inline-block">&larr; Back to Main Dashboard</span>
        </Link>

        <h1 className="text-4xl font-bold mb-4" style={{ color: '#00c6ff' }}>
          PG Management
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Use this page to add and manage admin accounts for the PG Management product.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Admin Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h2 className="text-2xl font-bold mb-5">Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <button type="submit" className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}>
                  Create Admin Account
                </button>
                {message && (
                  <p className={`text-sm mt-3 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* List of Admins */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg h-full" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h2 className="text-2xl font-bold mb-5">Current Admins</h2>
              {isLoading ? (
                <p>Loading admins...</p>
              ) : admins.length > 0 ? (
                <ul className="space-y-3">
                  {admins.map(admin => (
                    <li key={admin._id} className="p-4 bg-gray-800 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{admin.name}</p>
                        <p className="text-sm text-gray-400">{admin.email}</p>
                      </div>
                      <p className="text-xs text-gray-500">Joined: {new Date(admin.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No admins have been added for this product yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGManagementDashboard;
