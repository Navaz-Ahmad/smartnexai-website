"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react"; // --- ADDED: useState for form
// --- REVERTED IMPORTS TO FIX BUILD ERROR ---
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

export default function ContactPage() {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } };
    
    // --- ADDED: State for form inputs ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    // --- ADDED: Handler for input changes ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    // --- ADDED: Handler for form submission ---
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevents the default page reload
        console.log("Form Submitted:", formData);
        // Here you would typically send the formData to an API endpoint
        alert("Thank you for your message! (See console for data)");
        // Optionally reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
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
                        Contact Us
                    </motion.h1>
                    <motion.p 
                        style={{
                            color: '#ffffffdd',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                        }}
                        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        Have a project in mind or just want to learn more? We'd love to hear from you.
                    </motion.p>
                </div>
            </motion.section>

            {/* Contact Form Section */}
            <motion.section 
                className="pb-20 relative z-10"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        className="max-w-4xl mx-auto rounded-xl p-8 md:p-12" 
                        style={{background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)'}}
                        variants={itemVariants}
                    >
                        {/* --- FIXED: Added onSubmit handler --- */}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name Input */}
                                <div>
                                    <label htmlFor="name" className="block text-lg font-medium text-neutral-300">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-2 block w-full bg-black/20 border border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>
                                
                                {/* Email Address Input */}
                                <div>
                                    <label htmlFor="email" className="block text-lg font-medium text-neutral-300">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-2 block w-full bg-black/20 border border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>
                            </div>
                            
                            {/* Subject Input */}
                            <div className="mt-6">
                                <label htmlFor="subject" className="block text-lg font-medium text-neutral-300">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full bg-black/20 border border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                />
                            </div>
                            
                            {/* Message Textarea */}
                            <div className="mt-6">
                                <label htmlFor="message" className="block text-lg font-medium text-neutral-300">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows={5} 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full bg-black/20 border border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                ></textarea>
                            </div>
                            
                            {/* Submit Button */}
                            <div className="mt-8 text-right">
                                <motion.button 
                                    type="submit" 
                                    className="inline-block text-white font-semibold py-3 px-8 rounded-lg text-lg"
                                    style={{
                                        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                                        boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                                    }}
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 198, 255, 0.7)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Send Message
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}

