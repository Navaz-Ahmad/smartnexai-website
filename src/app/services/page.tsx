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

// Updated ServiceCard to match the glassmorphic design
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
        <svg className="w-10 h-10 mb-4" style={{color: '#00c6ff'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-4 text-neutral-300 text-base">{description}</p>
    </motion.div>
);

export default function ServicesPage() {
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
                        We provide a comprehensive suite of AI services designed to solve your most complex problems and drive business value.
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
                            title="Custom ML Models"
                            description="Development of bespoke machine learning models tailored to your specific data and business objectives, from predictive analytics to computer vision."
                            iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                        <ServiceCard
                            title="AI-Powered Analytics"
                            description="Unlock deep insights from your data. Our advanced analytics platform uses AI to identify trends, predict outcomes, and provide actionable intelligence."
                            iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                        <ServiceCard
                            title="Natural Language Processing"
                            description="Leverage our NLP solutions for sentiment analysis, text summarization, chatbots, and language understanding to enhance customer interaction and automate tasks."
                            iconPath="M3 5h12M9 3v2m4 13h4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6"
                        />
                        <ServiceCard
                            title="AI Strategy Consulting"
                            description="Work with our experts to develop a roadmap for AI integration. We help you identify opportunities, assess feasibility, and plan for successful implementation."
                            iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <ServiceCard
                            title="Data Engineering"
                            description="Building robust data pipelines and infrastructure to ensure your AI models are fed with clean, reliable, and real-time data for optimal performance."
                            iconPath="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4"
                        />
                        <ServiceCard
                            title="Automation Solutions"
                            description="Implement intelligent automation to streamline business processes, reduce operational costs, and free up your team to focus on high-value work."
                            iconPath="M12 6V4m0 16v-2m8-8h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414"
                        />
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
