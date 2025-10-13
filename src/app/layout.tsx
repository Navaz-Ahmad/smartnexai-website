import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "SmartNex.ai - Revolutionizing Industries with AI",
  description: "SmartNex.ai delivers cutting-edge AI solutions, including custom machine learning models, data analytics, and NLP to drive business growth and innovation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <Header />
        <main>{children}</main>
        <Footer />

        {/* === FLOATING CONTACT BUTTON (NOW VISIBLE ON ALL DEVICES) === */}
        <Link 
          href="/contact" 
          className="
            fixed bottom-6 right-6 
            bg-accent text-dark-bg 
            w-14 h-14 rounded-full 
            flex items-center justify-center 
            shadow-lg 
            transform transition-transform hover:scale-110 
            z-40 
            /* The 'md:hidden' class has been REMOVED from this line */
          "
          aria-label="Contact Us"
        >
          {/* Mail Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </Link>
        {/* === END OF FLOATING BUTTON === */}

      </body>
    </html>
  );
}