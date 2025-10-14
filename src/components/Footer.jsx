const Footer = () => {
  // Social media icons (simple SVGs)
  const SocialIcon = ({ href, path }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );

  return (
    <footer 
        className="relative z-10 mt-20"
        style={{
            background: 'rgba(13, 27, 42, 0.85)', 
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold" style={{color: '#00c6ff', textShadow: '0 0 20px rgba(0, 198, 255, 0.7)'}}>SmartNex.ai</h3>
            <p className="text-gray-400 mt-4 text-base">Revolutionizing industries with the power of Artificial Intelligence.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              <li><a href="/about" className="text-base text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/services" className="text-base text-gray-400 hover:text-white">Services</a></li>
              <li><a href="/products" className="text-base text-gray-400 hover:text-white">Products</a></li>
              <li><a href="/contact" className="text-base text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li><a href="/privacy-policy" className="text-base text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-base text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200">Connect With Us</h4>
            <div className="flex space-x-5 mt-4">
              <SocialIcon href="#" path="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z" />
              <SocialIcon href="#" path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              <SocialIcon href="#" path="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-1.02-.01-1.8-2.61.57-3.17-1.07-3.32-1.52-.12-.31-.58-1.17-.71-1.41-.12-.24-.29-.48-.02-.47.27.02.48.27.56.41.3.51.78.92 1.48.71.08-.55.33-.92.6-1.13-2.13-.24-4.36-1.07-4.36-4.73 0-.93.33-1.69.88-2.28-.09-.24-.38-1.08.08-2.25 0 0 .79-.25 2.62 1 .75-.21 1.55-.31 2.35-.31s1.6.1 2.35.31c1.83-1.25 2.62-1 2.62-1 .47 1.17.17 2.01.08 2.25.55.59.88 1.35.88 2.28 0 3.67-2.24 4.49-4.37 4.73.34.29.64.88.64 1.77 0 1.28-.01 2.32-.01 2.63 0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-base text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartNex.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

