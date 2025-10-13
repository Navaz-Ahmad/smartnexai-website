import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header"; // Correct path from app to components
import Footer from "../components/Footer"; // Correct path from app to components

export const metadata: Metadata = {
  title: "SmartNex.ai - Revolutionizing Industries with AI",
  description: "SmartNex.ai delivers cutting-edge AI solutions, including custom machine learning models, data analytics, and NLP to drive business growth and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header will appear at the top of every page */}
        <Header />

        {/* 'children' is where your page content (like the homepage) will be inserted */}
        <main>{children}</main>

        {/* Footer will appear at the bottom of every page */}
        <Footer />
      </body>
    </html>
  );
}