'use client'; 

import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
  ];

  // A new function to handle closing the menu
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header 
        className="sticky top-0 z-50"
        style={{
            background: 'rgba(13, 27, 42, 0.85)', 
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-3xl font-bold" style={{color: '#00c6ff', textShadow: '0 0 20px rgba(0, 198, 255, 0.7)'}}>
              SmartNex.ai
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <a href="/login" className="inline-block text-white font-semibold py-3 px-8 rounded-lg text-base transition-all duration-300"
               style={{
                 background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                 border: 'none',
                 boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 198, 255, 0.7)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.4)')}
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name} 
                href={link.href} 
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-3 rounded-md text-lg font-medium"
                onClick={handleLinkClick}
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 px-2">
              <a
                href="/login" 
                className="block text-center w-full text-white font-semibold py-3 px-4 rounded-lg text-lg transition-all duration-300"
                style={{
                    background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                }}
                onClick={handleLinkClick}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
