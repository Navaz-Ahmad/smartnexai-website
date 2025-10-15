"use client";

import { motion, Variants, TargetAndTransition } from "framer-motion";
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

// --- Team Member Helper Component ---
const TeamMember = ({ name, role, imageUrl }: { name: string; role: string; imageUrl: string }) => (
    <div
        className="text-center p-8 rounded-xl h-full"
        style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)',
        }}
    >
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-blue-500/50">
            <img
                src={imageUrl}
                alt={name}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">{name}</h3>
        <p style={{ color: '#00c6ff' }} className="font-medium text-lg">
            {role}
        </p>
    </div>
);

// --- Main About Page Component ---
export default function AboutPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const cardHoverEffect: TargetAndTransition = {
        scale: 1.05,
        boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)",
        transition: {
            type: "spring" as const,
            stiffness: 400,
            damping: 10,
        },
    };

    return (
        <div
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="text-neutral-800 dark:text-neutral-200 overflow-x-hidden"
        >
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
                            fontWeight: "700",
                            WebkitBackgroundClip: "text",
                            color: "#00c6ff",
                            textShadow: "0 0 20px rgba(0, 198, 255, 0.8)",
                        }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight"
                        variants={itemVariants}
                    >
                        About SmartNex.ai
                    </motion.h1>
                    <motion.p
                        style={{
                            fontWeight: "500",
                            color: "#ffffffdd",
                            textShadow: "0 0 8px rgba(255, 255, 255, 0.4)",
                        }}
                        className="mt-6 text-lg md:text-xl max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        We are a team of pioneers, innovators, and problem-solvers dedicated to harnessing the transformative power of Artificial Intelligence.
                    </motion.p>
                </div>
            </motion.section>

            {/* Mission & Vision Section */}
            <section className="py-16 relative z-10">
                <motion.div
                    className="container mx-auto px-6 grid md:grid-cols-2 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div
                        className="p-8 rounded-xl"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.35)",
                        }}
                        variants={itemVariants}
                        whileHover={cardHoverEffect}
                    >
                        <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                        <p className="mt-4 text-neutral-300 text-lg">
                            To empower businesses across the globe by providing accessible, cutting-edge AI technologies. We strive to create intelligent systems that drive efficiency, foster innovation, and unlock new opportunities for growth, making the future of AI a present reality for our clients.
                        </p>
                    </motion.div>

                    <motion.div
                        className="p-8 rounded-xl"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.35)",
                        }}
                        variants={itemVariants}
                        whileHover={cardHoverEffect}
                    >
                        <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                        <p className="mt-4 text-neutral-300 text-lg">
                            To be a global leader in AI innovation, creating a future where intelligent technology is seamlessly integrated into every aspect of business, enhancing human potential and solving the world’s most complex challenges.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Team Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        Meet Our Team
                    </motion.h2>
                    <motion.div
                        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div variants={itemVariants} whileHover={cardHoverEffect}>
                            <TeamMember
                                name="Dr. Evelyn Reed"
                                role="Founder & CEO"
                                imageUrl="https://placehold.co/200x200/00c6ff/FFFFFF?text=ER"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} whileHover={cardHoverEffect}>
                            <TeamMember
                                name="Marcus Chen"
                                role="Chief Technology Officer"
                                imageUrl="https://placehold.co/200x200/00c6ff/FFFFFF?text=MC"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} whileHover={cardHoverEffect}>
                            <TeamMember
                                name="Alina Petrova"
                                role="Head of Research"
                                imageUrl="https://placehold.co/200x200/00c6ff/FFFFFF?text=AP"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants} whileHover={cardHoverEffect}>
                            <TeamMember
                                name="Kenji Tanaka"
                                role="Lead AI Engineer"
                                imageUrl="https://placehold.co/200x200/00c6ff/FFFFFF?text=KT"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div
                        className="rounded-xl p-12"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.35)",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-neutral-300">
                                {/* THIS IS THE FIX 👇 */}
                                Let&apos;s discuss how SmartNex.ai can become your innovation partner. Connect with our experts today for a free consultation.
                            </p>
                            <motion.div
                                className="mt-8"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a
                                    href="/contact"
                                    className="inline-block text-white font-semibold py-4 px-10 rounded-lg text-lg transition-all duration-300"
                                    style={{
                                        background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                        border: "none",
                                        boxShadow: "0 0 10px rgba(0, 198, 255, 0.4)",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            "0 0 20px rgba(0, 198, 255, 0.7)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            "0 0 10px rgba(0, 198, 255, 0.4)")
                                    }
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