'use client';

import { useState, FormEvent } from 'react';

// Define a type for the user object we expect from the API
type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  productKey?: string; // The key for the product an admin is assigned to
};

// A component for the cool water drop background effect
const WaterDropOverlay = () => {
    const drops = Array.from({ length: 150 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * 20}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${8 + Math.random() * 10}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 8}s`,
        };
        return <div key={i} className="absolute rounded-full bg-gradient-to-b from-blue-200/50 to-transparent animate-raindrop" style={style}></div>;
    });

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            {drops}
        </div>
    );
};


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'superadmin'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user: User = data.user;
        console.log("Login successful:", user);
        localStorage.setItem('user', JSON.stringify(user));
        
        // --- ✨ NEW: Conditional Redirection Logic ---
        if (user.role === 'superadmin') {
          // Super Admins go to the main dashboard
          window.location.href = '/dashboard';
        } else if (user.role === 'admin' && user.productKey) {
          // Admins go to their specific product dashboard
          window.location.href = `/products/${user.productKey}`;
        } else {
          // Fallback for admins with no assigned product
          setError('You do not have a product assigned to your account.');
          setIsLoading(false);
          return;
        }
        // --- End of New Logic ---

      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // Don't set isLoading to false on success, as the page will redirect
      if (error) {
          setIsLoading(false);
      }
    }
  };

  return (
    <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
            background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)'
        }}
    >
        <WaterDropOverlay />
        
        {/* The Login Form Card */}
        <div 
            className="relative z-10 max-w-md w-full mx-4 p-8 sm:p-10 rounded-2xl shadow-2xl"
            style={{
                background: 'rgba(13, 27, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <h2 
                className="text-center text-4xl font-bold mb-8"
                style={{
                    color: '#00c6ff', 
                    textShadow: '0 0 20px rgba(0, 198, 255, 0.7)'
                }}
            >
                Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- Role Selector --- */}
                <div>
                    <label className="block text-lg font-medium text-gray-300 mb-2">Login as</label>
                    <div className="flex justify-center items-center bg-gray-900/50 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`w-1/2 py-2 text-center rounded-md transition-colors duration-300 ${role === 'admin' ? 'bg-cyan-600 text-white font-semibold shadow-md' : 'text-gray-400'}`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('superadmin')}
                            className={`w-1/2 py-2 text-center rounded-md transition-colors duration-300 ${role === 'superadmin' ? 'bg-cyan-600 text-white font-semibold shadow-md' : 'text-gray-400'}`}
                        >
                            Super Admin
                        </button>
                    </div>
                </div>
                {/* --- End of Role Selector --- */}

                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-lg font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                        placeholder="••••••••"
                    />
                </div>
                
                {error && <p className="text-red-400 text-center font-medium">{error}</p>}

                <div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                            boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                        }}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <p className="text-center mt-6 text-gray-400">
                Forgot your password?{' '}
                <a href="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300">
                    Reset Here
                </a>
            </p>
        </div>
    </div>
  );
};

export default LoginPage;

