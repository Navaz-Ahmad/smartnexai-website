'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for the data we store in localStorage
type TenantDetails = {
    tenant: {
        name: string;
        mobile: string;
    },
    pg: {
        name: string;
        address: string;
    }
};

const TenantDashboard = () => {
    const [details, setDetails] = useState<TenantDetails | null>(null);
    const router = useRouter();

    useEffect(() => {
        // On component mount, retrieve tenant details from localStorage
        const storedDetails = localStorage.getItem('tenantDetails');
        if (storedDetails) {
            setDetails(JSON.parse(storedDetails));
        } else {
            // If no details are found, redirect to the tenant login page
            router.push('/login/user');
        }
    }, [router]);

    const handleLogout = () => {
        // Clear the stored data and redirect to the login page
        localStorage.removeItem('tenantDetails');
        router.push('/login/user');
    };

    // Show a loading state until the details are loaded from localStorage
    if (!details) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>Loading your details...</p></div>;
    }

    return (
        <div className="min-h-screen p-8" style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }}>
            <div className="max-w-4xl mx-auto text-white">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold" style={{ color: '#00c6ff' }}>
                        Welcome, {details.tenant.name}
                    </h1>
                     <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 font-bold py-2 px-5 rounded-lg transition-colors">
                        Logout
                     </button>
                </div>

                <div className="p-6 rounded-lg shadow-lg" style={{ background: 'rgba(13, 27, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h2 className="text-2xl mb-4 border-b border-gray-700 pb-2">Your PG Information</h2>
                    <div className="space-y-3 text-lg">
                        <p><span className="font-semibold text-gray-400">PG Name:</span> {details.pg.name}</p>
                        <p><span className="font-semibold text-gray-400">Address:</span> {details.pg.address}</p>
                        <p><span className="font-semibold text-gray-400">Registered Mobile:</span> {details.tenant.mobile}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;