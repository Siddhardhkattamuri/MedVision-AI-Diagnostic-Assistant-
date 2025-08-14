// src/components/Features.js

import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

// SVG Icons for the feature cards
const IconBrain = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-14v4h-4v2h4v4h2v-4h4v-2h-4V6h-2z" fill="currentColor"/></svg> );
const IconPalette = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5c-6.627 0-12-5.373-12-12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12c-4.97 0-9-4.03-9-9s4.03-9 9-9c.83 0 1.5.67 1.5 1.5S12.83 3 12 3zm0 3c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6z" fill="currentColor"/></svg> );
const IconChat = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/></svg> );
const IconPin = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg> );

const featureList = [
    {
        icon: <IconBrain />,
        title: "Advanced AI Analysis",
        description: "Upload a chest X-ray image. Our hybrid CNN and VGG16 model analyzes it to detect signs of Pneumonia, Tuberculosis, or classifies it as Normal."
    },
    {
        icon: <IconPalette />,
        title: "Dynamic Visual Feedback",
        description: "The entire web page theme changes color to reflect the diagnosis results, providing instant and clear visual feedback—red, yellow, or green."
    },
    {
        icon: <IconChat />,
        title: "AI Health Assistant",
        description: "After a diagnosis, a contextual chatbot becomes available to answer questions about the specific condition detected, offering valuable information."
    },
    {
        icon: <IconPin />,
        title: "Find a Doctor",
        description: "The chatbot can help you find healthcare professionals. Simply ask it to 'Find a doctor near me' and provide your location."
    }
];

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Features = () => {
    return (
        <motion.section 
            className="features-section"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
        >
            <div className="features-grid">
                {featureList.map((feature, index) => (
                    <motion.div key={index} className="feature-card" variants={cardVariants}>
                        <div className="feature-icon">{feature.icon}</div>
                        <h3 className="feature-card-title">{feature.title}</h3>
                        <p className="feature-card-description">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default Features;