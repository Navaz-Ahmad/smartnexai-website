"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            // simulate API or real fetch if you have endpoint
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus("Failed to send message. Please try again.");
        }
    };

    // ✅ Fixed variant type error (ease now correctly typed)
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeInOut" as const, // <-- FIXED TYPE ISSUE
            },
        },
    };

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-16">
            <motion.div
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.2 }}
                className="max-w-3xl w-full text-center"
            >
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-extrabold leading-tight"
                >
                    Contact Us
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mt-4 text-gray-600 text-lg"
                >
                    We'd love to hear from you! Fill out the form below and we'll get back to you soon.
                </motion.p>

                <motion.form
                    onSubmit={handleSubmit}
                    variants={itemVariants}
                    className="mt-10 space-y-6 bg-white shadow-xl rounded-2xl p-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        Send Message
                    </motion.button>
                </motion.form>

                {status && (
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-gray-700 font-medium"
                    >
                        {status}
                    </motion.p>
                )}
            </motion.div>
        </section>
    );
}
