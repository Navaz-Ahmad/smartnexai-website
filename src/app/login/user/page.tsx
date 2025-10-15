'use client';

import { useState, FormEvent } from 'react';

const TenantLoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the combined tenant and PG details for the dashboard
        localStorage.setItem('tenantDetails', JSON.stringify(data));
        window.location.href = '/tenant-dashboard';
      } else {
        setError(data.message || 'Login failed. Please check your mobile number.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }}>
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl" style={{ background: 'rgba(13, 27, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h2 className="text-center text-4xl font-bold mb-8 text-white" style={{ textShadow: '0 0 10px rgba(0, 198, 255, 0.5)' }}>
          Tenant Portal Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobile" className="block text-lg font-medium text-gray-300 mb-2">
              Enter Your Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
              placeholder="e.g., 9014551644"
            />
          </div>
          {error && <p className="text-red-400 text-center font-medium">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3 rounded-lg text-lg transition-all duration-300 disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)' }}
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantLoginPage;