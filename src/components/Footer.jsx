import Link from 'next/link';


const Footer = () => {
  // Social media icons (simple SVGs)
  // I have removed the TypeScript type annotations from this line
  const SocialIcon = ({ href, path }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
  
  
  
  return (
    <footer className="bg-dark-bg border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-gradient">SmartNex.ai</h3>
            <p className="text-gray-400 mt-4 text-sm">Revolutionizing industries with the power of Artificial Intelligence.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-200">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-accent text-sm">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-accent text-sm">Services</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-accent text-sm">Products</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-200">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent text-sm">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-gray-200">Connect With Us</h4>
            <div className="flex space-x-4 mt-4">
                <SocialIcon href="#" path="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5.52 4.5 10.02 10 10.02 5.5 0 10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM16.5 8.25l-1.5-1.5L12 9.75l-3-3-1.5 1.5L10.5 12l-3 3 1.5 1.5L12 14.25l3 3 1.5-1.5L13.5 12l3-3z" />
                <SocialIcon href="#" path="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z" />
                <SocialIcon href="#" path="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM6 9h4v12H6z" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartNex.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;