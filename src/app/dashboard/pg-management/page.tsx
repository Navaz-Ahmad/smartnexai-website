'use client';

import Link from 'next/link';
import React, { FormEvent, useEffect, useState } from 'react';
import { COLORS } from '@/constants/colors'; // Correct path for Next.js

// Define types
type Admin = {
  _id: string;
  name: string;
  email: string;
};

type Message = {
  type: 'success' | 'error';
  text: string;
};

// Simple SVG Icon for the chevron
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5" style={{ color: COLORS.primary }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const PGManagementDashboard = () => {
  // Form state for creating a new admin
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // State for data and feedback
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
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to create a new admin
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
        setName(''); setEmail(''); setPhone(''); setPassword('');
        fetchProductAdmins();
      } else {
        throw new Error(data.message || 'Failed to create admin');
      }
    } catch (error: unknown) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-8 inline-block">&larr; Back to Main Dashboard</Link>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#00c6ff' }}>PG Management</h1>
        <p className="text-lg text-gray-300 mb-10">Use this page to add and manage admin accounts for the PG Management product.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Admin Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h2 className="text-2xl font-bold mb-5">Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="block w-full bg-gray-800 p-2 rounded-md" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="block w-full bg-gray-800 p-2 rounded-md" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="block w-full bg-gray-800 p-2 rounded-md" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="block w-full bg-gray-800 p-2 rounded-md" />
                <button type="submit" className="w-full text-white font-semibold py-2 px-4 rounded-lg" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}>Create Admin Account</button>
              </form>
            </div>
          </div>

          {/* List of Admins */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg h-full" style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h2 className="text-2xl font-bold mb-5">Current Admins</h2>
              {message && <p className={`text-sm mb-4 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>}
              {isLoading ? <p>Loading admins...</p> : admins.length > 0 ? (
                <ul className="space-y-3">
                  {admins.map(admin => (
                    // **UPDATED: This is now a clean link. Edit/Remove buttons are GONE.**
                    <li key={admin._id}>
                      <Link 
                        href={`/dashboard/admin-details/${admin._id}`}
                        className="p-4 bg-gray-800 rounded-md flex justify-between items-center transition-colors hover:bg-gray-700/50"
                      >
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-lg truncate">{admin.name}</p>
                          <p className="text-sm text-gray-400 truncate">{admin.email}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2 text-cyan-400">
                           <span className="text-sm font-medium">Manage</span>
                           <ChevronRightIcon />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-400">No admins have been added for this product yet.</p>}
            </div>
          </div>
        </div>
      </div>
      
      {/* All Modals and Edit/Delete logic have been removed from this file. */}

    </div>
  );
};

export default PGManagementDashboard;