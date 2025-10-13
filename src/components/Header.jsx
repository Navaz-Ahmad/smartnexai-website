'use client'; // This directive is needed for using React hooks like useState

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // This array controls the navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' }, // <-- This line creates the link
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gradient">
              SmartNex.ai
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-300 hover:text-accent transition-colors duration-200">
                {link.name}
              </Link>
            ))}
          </nav>

           {/* Call to Action Button - Desktop */}
           <div className="hidden md:block">
             <Link href="/contact" className="bg-accent text-dark-bg font-semibold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
                Get a Quote
             </Link>
           </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                {link.name}
              </Link>
            ))}
             <div className="mt-4">
              <Link href="/contact" className="bg-accent text-dark-bg font-semibold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 block text-center">
                  Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;