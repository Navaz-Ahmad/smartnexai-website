'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import { COLORS } from '@/constants/colors';

type PgWithCount = {
  _id: string;
  name: string;
  address: string;
  tenantCount: number;
};

type AdminDetails = {
  name: string;
  email: string;
  phone?: string;
};

// A web-standard SVG component for the building icon
const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-5" style={{ color: COLORS.primary }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

const AdminDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const adminId = params.adminId as string;

  const [pgs, setPgs] = useState<PgWithCount[]>([]);
  const [admin, setAdmin] = useState<AdminDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!adminId) return;

    const fetchAllDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [adminRes, pgsRes] = await Promise.all([
          fetch(`/api/admins/${adminId}`),
          fetch(`/api/admins/${adminId}/pgs`)
        ]);

        const adminData = await adminRes.json();
        if (!adminRes.ok) throw new Error(adminData.message || 'Failed to fetch admin details.');
        setAdmin(adminData.admin);

        const pgsData = await pgsRes.json();
        if (!pgsRes.ok) throw new Error(pgsData.message || 'Failed to fetch PG stats.');
        setPgs(pgsData.pgs);

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDetails();
  }, [adminId]);

  const handleUpdateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    try {
        const response = await fetch('/api/admins', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: adminId, ...admin }),
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message);
        setMessage('Admin updated successfully!');
        setIsEditModalOpen(false);
    } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleDeleteAdmin = async () => {
    try {
        const response = await fetch(`/api/admins?id=${adminId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message);
        router.push('/dashboard/pg-management');
    } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/pg-management" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-8 inline-block">&larr; Back to All Admins</Link>
        
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-4xl font-bold" style={{ color: COLORS.primary }}>{admin?.name || 'Admin'} Overview</h1>
                <p className="text-lg text-gray-300 mt-2">{admin?.email}</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setIsEditModalOpen(true)} className="py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold">Edit</button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 font-semibold">Remove</button>
            </div>
        </div>

        {message && <p className="text-green-400 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {isLoading ? <p>Loading details...</p> : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Properties Overview</h2>
            {pgs.length > 0 ? pgs.map(pg => (
              <div key={pg._id} className="bg-gray-800/50 p-6 rounded-lg flex items-center justify-between border border-gray-700">
                <div className="flex items-center">
                  <BuildingIcon />
                  <div>
                    <h3 className="text-xl font-bold">{pg.name}</h3>
                    <p className="text-sm text-gray-400">{pg.address}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">{pg.tenantCount}</p>
                  <p className="text-xs text-gray-400">Total Tenants</p>
                </div>
              </div>
            )) : <p className="text-gray-400">This admin has not created any PGs yet.</p>}
          </div>
        )}
      </div>

      {isEditModalOpen && admin && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <h2 className="text-2xl font-bold mb-4">Edit Admin Details</h2>
                  <form onSubmit={handleUpdateAdmin} className="space-y-4">
                      <input type="text" value={admin.name} onChange={e => setAdmin({...admin, name: e.target.value})} className="w-full bg-gray-700 p-3 rounded-md"/>
                      <input type="email" value={admin.email} onChange={e => setAdmin({...admin, email: e.target.value})} className="w-full bg-gray-700 p-3 rounded-md"/>
                      <input type="tel" value={admin.phone ?? ''} onChange={e => setAdmin({...admin, phone: e.target.value})} className="w-full bg-gray-700 p-3 rounded-md"/>
                      <div className="flex justify-end gap-4 mt-6">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-500">Cancel</button>
                          <button type="submit" className="py-2 px-4 rounded-lg text-white" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}>Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {isDeleteModalOpen && admin && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center" style={{border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
                  <p className="text-gray-300 mb-6">Do you really want to remove <span className="font-semibold">{admin.name}</span>? This action cannot be undone.</p>
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

export default AdminDetailsPage;