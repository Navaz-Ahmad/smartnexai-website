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

// ServiceCard Component (glassmorphic design)
const ServiceCard = ({ title, description, iconPath }: { title: string, description: string, iconPath: string }) => (
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
        <svg className="w-10 h-10 mb-4" style={{ color: '#00c6ff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-4 text-neutral-300 text-base">{description}</p>
    </motion.div>
);

export default function ServicesPage() {
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
                <div className="container mx-auto px-4">
                    <motion.h1
                        style={{
                            fontWeight: '700',
                            color: '#00c6ff',
                            textShadow: '0 0 20px rgba(0, 198, 255, 0.8)',
                        }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight"
                        variants={itemVariants}
                    >
                        Our Services
                    </motion.h1>
                    <motion.p
                        style={{
                            color: '#ffffffdd',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                        }}
                        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        We offer cutting-edge AI and automation solutions for businesses, educational institutions, and industries to streamline operations, increase productivity, and drive growth.
                    </motion.p>
                </div>
            </motion.section>

            {/* Services Grid Section */}
            <motion.section
                className="py-16 relative z-10"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <ServiceCard
                            title="College, Mess & PG Automation"
                            description="Comprehensive platforms for student, mess, and PG management, including attendance, billing, communication, and reporting."
                            iconPath="M3 7h18M3 12h18M3 17h18"
                        />

                        <ServiceCard
                            title="Computer Vision Attendance Tracking"
                            description="AI-powered camera systems to automatically track attendance in schools, colleges, offices, or industries."
                            iconPath="M12 8c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z M12 14c-2.667 0-8 1.333-8 4v2h16v-2c0-2.667-5.333-4-8-4z"
                        />

                        <ServiceCard
                            title="AI-Powered Analytics"
                            description="Transform your raw data into actionable insights using predictive models and AI-driven reporting tools."
                            iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"
                        />

                        <ServiceCard
                            title="Custom AI Solutions"
                            description="Have a challenge or idea? Our experts design bespoke solutions tailored to your business requirements."
                            iconPath="M12 6V4m0 16v-2M6 12H2m20 0h-4"
                        />

                        <ServiceCard
                            title="Automation & Workflow Optimization"
                            description="Streamline repetitive processes and boost operational efficiency with intelligent automation tools."
                            iconPath="M4 4h16v16H4z"
                        />

                        <ServiceCard
                            title="Coming Soon: Innovative Tools"
                            description="We continuously innovate to deliver new AI and automation products that cater to your evolving needs."
                            iconPath="M12 2l3 7H9l3-7z"
                        />

                    </div>
                </div>
            </motion.section>
        </div>
    );
}
