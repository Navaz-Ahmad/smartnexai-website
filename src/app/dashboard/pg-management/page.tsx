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
  // Form state for creating a new admin
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // State for data, feedback, and modals
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  
  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);


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
  
  // Handler to update an existing admin
  const handleUpdateAdmin = async (e: FormEvent) => {
      e.preventDefault();
      if (!editingAdmin) return;
      
      try {
          const response = await fetch('/api/admins', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: editingAdmin._id, name: editingAdmin.name, email: editingAdmin.email, phone: editingAdmin.phone }),
          });
          const data = await response.json();
          if(response.ok) {
              setMessage({ type: 'success', text: 'Admin updated successfully!' });
              setIsEditModalOpen(false);
              fetchProductAdmins();
          } else {
              throw new Error(data.message || 'Failed to update admin');
          }
      } catch (error: unknown) {
           setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred while updating' });
      }
  };

  // Handler to delete an admin
  const handleDeleteAdmin = async () => {
      if (!deletingAdmin) return;

      try {
          const response = await fetch('/api/admins', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: deletingAdmin._id }),
          });
          const data = await response.json();
          if(response.ok) {
              setMessage({ type: 'success', text: 'Admin removed successfully!' });
              setIsDeleteModalOpen(false);
              fetchProductAdmins();
          } else {
              throw new Error(data.message || 'Failed to remove admin');
          }
      } catch (error: unknown) {
           setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred while deleting' });
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
                    <li key={admin._id} className="p-4 bg-gray-800 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{admin.name}</p>
                        <p className="text-sm text-gray-400">{admin.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => { setEditingAdmin(admin); setIsEditModalOpen(true); }} className="text-sm text-cyan-400 hover:text-cyan-300">Edit</button>
                        <button onClick={() => { setDeletingAdmin(admin); setIsDeleteModalOpen(true); }} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-400">No admins have been added for this product yet.</p>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Admin Modal */}
      {isEditModalOpen && editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <h2 className="text-2xl font-bold mb-4">Edit Admin</h2>
                  <form onSubmit={handleUpdateAdmin} className="space-y-4">
                      <input type="text" value={editingAdmin.name} onChange={e => setEditingAdmin({...editingAdmin, name: e.target.value})} className="w-full bg-gray-700 p-2 rounded-md"/>
                      <input type="email" value={editingAdmin.email} onChange={e => setEditingAdmin({...editingAdmin, email: e.target.value})} className="w-full bg-gray-700 p-2 rounded-md"/>
                      <input type="tel" value={editingAdmin.phone} onChange={e => setEditingAdmin({...editingAdmin, phone: e.target.value})} className="w-full bg-gray-700 p-2 rounded-md"/>
                      <div className="flex justify-end gap-4 mt-6">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-500">Cancel</button>
                          <button type="submit" className="py-2 px-4 rounded-lg text-white" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}>Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
       {isDeleteModalOpen && deletingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
                  <p className="text-gray-300 mb-6">Do you really want to remove <span className="font-semibold">{deletingAdmin.name}</span>? This action cannot be undone.</p>
                  <div className="flex justify-center gap-4">
                      <button onClick={() => setIsDeleteModalOpen(false)} className="py-2 px-6 rounded-lg bg-gray-600 hover:bg-gray-500">Cancel</button>
                      <button onClick={handleDeleteAdmin} className="py-2 px-6 rounded-lg bg-red-600 hover:bg-red-500 text-white">Delete</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default PGManagementDashboard;

