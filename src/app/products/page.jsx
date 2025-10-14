"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// --- Animated Background Component ---
const AnimatedBackground = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: { color: '#0d1b2a' },
                particles: {
                    number: { value: 200, density: { enable: true, area: 800 } },
                    size: { value: 5, random: true },
                    move: { enable: true, speed: 1, direction: "none", random: true },
                    opacity: { value: 0.6, random: true, animation: { enable: true, speed: 1, minimumValue: 0.3 } },
                    color: { value: ['#ffffff', '#00c6ff', '#ff9b9b'] },
                    shape: { type: 'circle' },
                    links: { enable: true, color: '#4f5d75', distance: 100, opacity: 0.2 },
                },
                interactivity: {
                    events: {
                        onHover: { enable: false, mode: 'repulse' },
                        onClick: { enable: true, mode: 'push' },
                    },
                    modes: {
                        repulse: { distance: 150, duration: 0.4 },
                        push: { particles_nb: 3 },
                    },
                },
            }}
            style={{ position: 'fixed', width: '100%', height: '100%', zIndex: -1 }}
        />
    );
};

// ProductCard Component with new styling
const ProductCard = ({ title, description, version }: { title: string, description: string, version: string }) => (
  <motion.div 
    className="p-8 rounded-xl flex flex-col" 
    style={{
        background: 'rgba(255, 255, 255, 0.12)', 
        backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255, 255, 255, 0.25)', 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'
    }}
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
  >
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <span 
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{backgroundColor: 'rgba(0, 198, 255, 0.2)', color: '#00c6ff'}}
        >
            {version}
        </span>
      </div>
      <p className="mt-4 text-neutral-300 text-base">{description}</p>
    </div>
    <div className="mt-6">
      <a href="/contact" className="font-semibold text-lg transition-colors duration-300" style={{color: '#00c6ff'}}>
        Request a Demo &rarr;
      </a>
    </div>
  </motion.div>
);


export default function ProductsPage() {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }} className="overflow-x-hidden">
            <AnimatedBackground />

            {/* Hero Section */}
            <motion.section 
                className="py-24 md:py-32 text-center relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="container mx-auto px-6">
                    <motion.h1 
                        style={{
                            fontWeight: '700',
                            color: '#00c6ff',
                            textShadow: '0 0 20px rgba(0, 198, 255, 0.8)',
                        }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight"
                        variants={itemVariants}
                    >
                        Our Products
                    </motion.h1>
                    <motion.p 
                        style={{
                            color: '#ffffffdd',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                        }}
                        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        Proprietary AI platforms designed for performance, scalability, and ease of use.
                    </motion.p>
                </div>
            </motion.section>

            {/* Products Grid Section */}
            <motion.section 
                className="py-16 relative z-10"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProductCard 
                            title="NexusFlow AI" 
                            description="An end-to-end MLOps platform that simplifies the entire machine learning lifecycle, from data preparation and model training to deployment and monitoring."
                            version="v2.5"
                        />
                        <ProductCard 
                            title="CogniSynth Platform" 
                            description="A powerful generative AI suite for creating high-quality text, code, and images. Perfect for content creation, software development, and design automation."
                            version="v1.8"
                        />
                        <ProductCard 
                            title="PredictivePulse" 
                            description="Our flagship predictive analytics tool that provides highly accurate forecasts for sales, customer churn, and market trends, helping you make data-driven decisions."
                            version="v3.2"
                        />
                        <ProductCard 
                            title="VisionGuard" 
                            description="An advanced computer vision solution for real-time object detection, facial recognition, and quality control in manufacturing and security applications."
                            version="v4.1"
                        />
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
