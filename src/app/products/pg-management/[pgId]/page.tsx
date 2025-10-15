'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import Link from 'next/link';

// Define types for our data structures
type Tenant = {
  _id: string;
  name: string;
  mobile: string;
  address: string;
};

type Message = {
  type: 'success' | 'error';
  text: string;
};

// This component receives params from Next.js for dynamic routes like [pgId]
const ManagePgPage = ({ params }: { params: { pgId: string } }) => {
  const { pgId } = params;
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const [tenantName, setTenantName] = useState('');
  const [tenantMobile, setTenantMobile] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');

  const fetchTenants = useCallback(async () => {
    try {
      const tenantsRes = await fetch(`/api/tenants?pgId=${pgId}`);
      if (!tenantsRes.ok) throw new Error('Failed to fetch tenants.');
      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData.tenants);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [pgId]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleOpenEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleAddTenant = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tenantName, mobile: tenantMobile, address: tenantAddress, pgId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to add tenant');

      setMessage({ type: 'success', text: 'Tenant added successfully!' });
      setTenantName('');
      setTenantMobile('');
      setTenantAddress('');
      fetchTenants();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    }
  };

  const handleUpdateTenant = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    try {
      const response = await fetch('/api/tenants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: selectedTenant._id,
          name: selectedTenant.name,
          mobile: selectedTenant.mobile,
          address: selectedTenant.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update tenant');

      setIsEditModalOpen(false);
      fetchTenants();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    }
  };

  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;

    try {
      const response = await fetch(`/api/tenants?tenantId=${selectedTenant._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete tenant');

      setIsDeleteModalOpen(false);
      fetchTenants();
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
        <Link href="/products/pg-management" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            &larr; Back to All PGs
        </Link>
        <h1 className="text-4xl font-bold" style={{ color: '#00c6ff' }}>Manage PG</h1>
        <p className="text-gray-400 mb-10">Add, view, edit, and remove tenants for this PG.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add Tenant Form */}
            <div className="lg:col-span-1">
                <div className="p-6 rounded-lg" style={{ background: 'rgba(13, 27, 42, 0.9)'}}>
                    <h2 className="text-2xl font-bold mb-5">Add New Tenant</h2>
                    <form onSubmit={handleAddTenant} className="space-y-4">
                        {/* Form fields remain the same */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Full Name</label>
                            <input type="text" value={tenantName} onChange={e => setTenantName(e.target.value)} required className="mt-1 w-full bg-gray-800 p-2 rounded-md border border-gray-600" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Mobile Number</label>
                            <input type="tel" value={tenantMobile} onChange={e => setTenantMobile(e.target.value)} required className="mt-1 w-full bg-gray-800 p-2 rounded-md border border-gray-600" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Home Address</label>
                            <textarea value={tenantAddress} onChange={e => setTenantAddress(e.target.value)} required rows={3} className="mt-1 w-full bg-gray-800 p-2 rounded-md border border-gray-600" />
                        </div>
                        <button type="submit" className="w-full text-white font-semibold py-2 rounded-lg" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)'}}>Add Tenant</button>
                        {message && <p className={`text-sm mt-3 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>}
                    </form>
                </div>
            </div>
            {/* List of Tenants */}
            <div className="lg:col-span-2">
                <div className="p-6 rounded-lg h-full" style={{ background: 'rgba(13, 27, 42, 0.9)'}}>
                    <h2 className="text-2xl font-bold mb-5">Current Tenants</h2>
                    {isLoading ? <p>Loading tenants...</p> : tenants.length > 0 ? (
                        <div className="space-y-3">
                            {tenants.map(t => (
                                <div key={t._id} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{t.name}</h3>
                                        <p className="text-sm text-gray-400">{t.mobile} | {t.address}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleOpenEditModal(t)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Edit</button>
                                        <button onClick={() => handleOpenDeleteModal(t)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400">No tenants have been added to this PG yet.</p>}
                </div>
            </div>
        </div>
      </div>

      {/* Edit Tenant Modal */}
      {isEditModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Tenant</h2>
                <form onSubmit={handleUpdateTenant} className="space-y-4">
                     <div>
                        <label className="block text-sm text-gray-400">Full Name</label>
                        <input type="text" value={selectedTenant.name} onChange={e => setSelectedTenant({...selectedTenant, name: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400">Mobile Number</label>
                        <input type="tel" value={selectedTenant.mobile} onChange={e => setSelectedTenant({...selectedTenant, mobile: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded"/>
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400">Home Address</label>
                        <textarea value={selectedTenant.address} onChange={e => setSelectedTenant({...selectedTenant, address: e.target.value})} rows={3} className="mt-1 w-full bg-gray-700 p-2 rounded"/>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-600 py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 py-2 px-4 rounded">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to remove <span className="font-bold">{selectedTenant.name}</span>? This action cannot be undone.</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-600 py-2 px-6 rounded">Cancel</button>
                    <button onClick={handleDeleteTenant} className="bg-red-600 py-2 px-6 rounded">Confirm Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManagePgPage;

