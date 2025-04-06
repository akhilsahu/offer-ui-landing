import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ContactForm } from '@/components/onboarding/ContactForm';
import '@/styles/OnboardingIncomplete.css';

export function OnboardingIncompleteScreen() {
  const [showContactForm, setShowContactForm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    navigate('/');
  };

  return (
    <div className="onboarding-incomplete-container">
      {/* Animated background */}
      <div className="onboarding-incomplete-bg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="onboarding-incomplete-shape"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              rotate: [Math.random() * 360, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="onboarding-incomplete-content">
        {!showContactForm ? (
          <motion.div
            className="onboarding-incomplete-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="onboarding-incomplete-icon">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="2"/>
                <path d="M50 25V50L62.5 62.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF3D71" />
                    <stop offset="0.5" stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h1 className="onboarding-incomplete-title">
              Your onboarding is not complete
            </h1>
            
            <p className="onboarding-incomplete-description">
              Please allow us time. We'll get back to you once your profile has been reviewed and approved.
            </p>
            
            <div className="onboarding-incomplete-buttons">
              <button 
                className="onboarding-incomplete-button-contact"
                onClick={() => setShowContactForm(true)}
              >
                Reach Us
              </button>
              
               
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="onboarding-incomplete-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              className="onboarding-incomplete-back-button"
              onClick={() => setShowContactForm(false)}
            >
              ← Back
            </button>
            <h2 className="onboarding-incomplete-subtitle">Contact Us</h2>
            <ContactForm onSuccess={() => setShowContactForm(false)} />
          </motion.div>
        )}
      </div>
    </div>
  );
}