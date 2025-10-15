'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

// Define a type for the user object
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

// Define a type for the Product object
type Product = {
  _id: string;
  productName: string;
  description: string;
  accessUrl: string; // e.g., '/dashboard/pg-management'
};

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProducts(parsedUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchProducts = async (currentUser: User) => {
    try {
      // We will create this API endpoint next
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' }}
    >
      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-50 py-4"
        style={{ 
          background: 'rgba(27, 39, 53, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#00c6ff', textShadow: '0 0 10px rgba(0, 198, 255, 0.5)' }}>
            Main Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 font-bold py-2 px-5 rounded-lg transition-colors duration-300 flex-shrink-0"
          >
            Logout
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="p-6 rounded-lg shadow-lg mb-12"
            style={{ background: 'rgba(13, 27, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <h2 className="text-2xl mb-4">Welcome back, {user.name}!</h2>
            <p className="text-lg"><span className="font-semibold text-gray-400">Role:</span> <span className="capitalize bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md">{user.role}</span></p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">Available Products</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link href={product.accessUrl} key={product._id}>
                    <div className="block p-6 rounded-lg h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/30"
                         style={{ background: 'rgba(13, 27, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <h3 className="text-2xl font-bold text-cyan-400 mb-3">{product.productName}</h3>
                      <p className="text-gray-300">{product.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-10">No products are currently assigned to your account.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

