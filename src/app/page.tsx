"use client";

import { motion, Variants, TargetAndTransition } from "framer-motion"; 
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const BrainCircuitIcon = () => (
 <svg
  className="w-12 h-12 text-blue-500"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
 >
  <path
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
   d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.898 21.75l-.21-1.197a3.375 3.375 0 00-2.283-2.283L13.5 18l1.197-.21a3.375 3.375 0 002.283-2.283L18 13.5l.21 1.197a3.375 3.375 0 002.283 2.283L21.75 18l-1.197.21a3.375 3.375 0 00-2.283 2.283z"
  />
 </svg>
);

const ScalingIcon = () => (
 <svg
  className="w-12 h-12 text-blue-500"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
 >
  <path
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
   d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25-6h-4.5m4.5 0v-4.5m0 4.5L15 9"
  />
 </svg>
);

const ExpertTeamIcon = () => (
 <svg
  className="w-12 h-12 text-blue-500"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
 >
  <path
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
   d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
  />
 </svg>
);

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

export default function Home() {
    const containerVariants: Variants = { 
        hidden: { opacity: 0 }, 
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } } 
    };

    const itemVariants: Variants = { 
        hidden: { y: 20, opacity: 0 }, 
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } 
    };
    
    const cardHoverEffect: TargetAndTransition = { 
        scale: 1.05, 
        boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)", 
        transition: { type: "spring", stiffness: 400, damping: 10 } 
    };

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif" }} className="text-neutral-800 dark:text-neutral-200 overflow-x-hidden">
            <AnimatedBackground />

            {/* Hero Section */}
            <motion.section 
                className="py-24 md:py-40 text-center relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="container mx-auto px-6">
                    <motion.h1 
                        style={{
                            fontWeight: '700',
                            WebkitBackgroundClip: 'text',
                            color: '#00c6ff',
                            textShadow: '0 0 20px rgba(0, 198, 255, 0.8)',
                        }}
                        // UPDATED: Adjusted text sizes for different screen widths
                        className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight"
                        variants={itemVariants}
                    >
                        AI-Driven Solutions for Modern Businesses
                    </motion.h1>
                    <motion.p 
                        style={{
                            fontWeight: '500',
                            color: '#ffffffdd',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                        }}
                        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        At SmartNex AI, we deliver intelligent, scalable, and customized software solutions that empower your business to operate efficiently and innovate fearlessly.
                    </motion.p>
                    <motion.div 
                        className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
                        variants={itemVariants}
                    >
                        <motion.a 
                            href="/services" 
                            className="block w-full sm:w-auto font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-lg"
                            style={{
                                background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                                border: 'none',
                                boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                                color: 'white'
                            }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 198, 255, 0.7)' }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore Services
                        </motion.a>
                        <motion.a 
                            href="/contact" 
                            className="block w-full sm:w-auto font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-lg"
                            style={{
                                background: 'rgba(255, 255, 255, 0.12)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                color: '#ffffffdd'
                            }}
                            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.2)' }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Us
                        </motion.a>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-20">
                <div className="container mx-auto px-6">
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose SmartNex AI?</h2>
                        <p className="mt-4 text-lg md:text-xl text-neutral-300">Innovative AI solutions that drive measurable business impact.</p>
                    </motion.div>
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, amount: 0.2 }}>
                        {[ 
                            { icon: <BrainCircuitIcon />, title: "Tailored AI Solutions", description: "Custom-built AI models aligned with your unique business goals and operational requirements." }, 
                            { icon: <ScalingIcon />, title: "Scalable Systems", description: "Flexible, robust infrastructure that grows seamlessly with your business and data." }, 
                            { icon: <ExpertTeamIcon />, title: "Expert Team", description: "Access to experienced AI engineers and consultants committed to your project's success." } 
                        ].map((feature, i) => (
                            <motion.div key={i} className="p-8 rounded-xl" style={{background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'}} variants={itemVariants} whileHover={cardHoverEffect}>
                                <div className="flex justify-center items-center h-16">{feature.icon}</div>
                                <h3 className="mt-6 text-xl font-semibold text-white text-center">{feature.title}</h3>
                                <p className="mt-2 text-base text-neutral-300 text-center">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Our Process Section */}
            <section id="process" className="relative z-10 py-20">
                <div className="container mx-auto px-6">
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Proven Process</h2>
                        <p className="mt-4 text-lg md:text-xl text-neutral-300">Structured methodology to deliver high-impact AI solutions efficiently.</p>
                    </motion.div>
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-transparent">
                            <svg width="100%" height="100%"><line x1="0" y1="0" x2="100%" y2="0" strokeWidth="2" strokeDasharray="8 8" className="stroke-neutral-700"></line></svg>
                        </div>
                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12" initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true, amount: 0.2 }}>
                            {[ 
                                { title: "1. Discovery & Strategy", description: "We analyze your business objectives and craft a precise AI strategy for maximum impact." }, 
                                { title: "2. Development & Integration", description: "Custom AI solutions are developed and seamlessly integrated into your workflows." }, 
                                { title: "3. Deployment & Optimization", description: "Solutions are deployed and continuously optimized for performance and business value." } 
                            ].map((step, i) => (
                                <motion.div key={i} className="relative z-10" variants={itemVariants}>
                                    <div className="p-6 rounded-lg text-center" style={{background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'}}>
                                        <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/50 text-blue-400 font-bold text-xl">{i + 1}</div>
                                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                                        <p className="mt-2 text-base text-neutral-300">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="rounded-xl shadow-lg p-12" style={{background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'}}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Partner with SmartNex AI Today</h2>
                            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-neutral-300">
                                Discover how our AI-powered solutions can transform your operations and accelerate growth. Connect with our team for a personalized consultation.
                            </p>
                            <motion.div className="mt-8">
                                <a href="/contact" className="inline-block text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                                        border: 'none',
                                        boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 198, 255, 0.7)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.4)')}
                                >
                                    Get Started
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
