"use client";

import { motion, Variants } from "framer-motion";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Animated Background Component ---
const AnimatedBackground = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
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

// ProductCard Component
const ProductCard = ({
    title,
    description,
    version,
    isCustom = false
}: { title: string, description: string, version: string, isCustom?: boolean }) => (
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
            {isCustom ? (
                <a href="/contact" className="font-semibold text-lg transition-colors duration-300" style={{color: '#00c6ff'}}>
                    Contact Us &rarr;
                </a>
            ) : (
                <a href="/contact" className="font-semibold text-lg transition-colors duration-300" style={{color: '#00c6ff'}}>
                    Request a Demo &rarr;
                </a>
            )}
        </div>
    </motion.div>
);

export default function ProductsPage() {
    const containerVariants: Variants = { 
        hidden: { opacity: 0 }, 
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } } 
    };

    const itemVariants: Variants = { 
        hidden: { y: 20, opacity: 0 }, 
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } 
    };

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
                        Automation solutions for education, mess, PG management, and industry operations, designed for efficiency and scalability.
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
                            title="College Management System" 
                            description="A comprehensive platform to manage student records, attendance, timetable, exams, and communication with faculty and parents."
                            version="v3.0"
                        />
                        <ProductCard 
                            title="Mess Management System" 
                            description="Automate menu planning, billing, inventory, and attendance for mess and canteen operations, ensuring smooth daily management."
                            version="v2.5"
                        />
                        <ProductCard 
                            title="PG Management System" 
                            description="Efficiently manage room allocation, occupancy, billing, and resident communications in hostels, PGs, or dormitories."
                            version="v4.1"
                        />
                        <ProductCard 
                            title="Automation Suite for Institutions" 
                            description="Integrate college, mess, and PG management into a single dashboard for real-time insights, notifications, and reporting."
                            version="v1.9"
                        />
                        <ProductCard 
                            title="Computer Vision-based Automated Attendance Tracking" 
                            description="Leverage AI and camera-based recognition to automatically track attendance for employees or students in any industry or institution."
                            version="v1.0"
                        />
                        <ProductCard 
                            title="Coming Soon: Industry-Specific Automation Tools" 
                            description="We are continuously innovating to bring more solutions tailored to your business needs. Stay tuned for upcoming products!"
                            version="—"
                        />
                        <ProductCard 
                            title="Custom Solutions: Your Ideas, Our Expertise" 
                            description="Have a problem you want solved? Share your ideas with us and we will build a custom solution to streamline your operations."
                            version="—"
                            isCustom={true} // ✅ Custom card shows Contact Us
                        />
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
