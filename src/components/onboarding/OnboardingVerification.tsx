import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import confetti from '@/lib/confetti';

interface OnboardingVerificationProps {
  email: string;
}

export function OnboardingVerification({ email }: OnboardingVerificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Trigger confetti effect after component mounts
    const timer = setTimeout(() => {
      setShowConfetti(true);
      confetti();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="onboarding-verification-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="onboarding-card-content">
        <motion.div 
          className="onboarding-icon-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
        >
          <Mail strokeWidth={1.5} className="onboarding-icon" />
          <motion.div
            className="onboarding-icon-sparkle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Sparkles size={16} />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="onboarding-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Please verify your email id
        </motion.h1>
        
        <motion.div
          className="onboarding-email-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="onboarding-email">{email || 'your-email@example.com'}</span>
        </motion.div>
        
        <motion.p 
          className="onboarding-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          We've sent a verification link to your email address.
          Please check your inbox and click the link to verify your account.
        </motion.p>
        
        <motion.div 
          className="onboarding-verification-steps"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <CheckCircle2 size={20} />
            </div>
            <span>Check your email inbox</span>
          </div>
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <CheckCircle2 size={20} />
            </div>
            <span>Click the verification link</span>
          </div>
          <div className="onboarding-step">
            <div className="onboarding-step-icon">
              <Clock size={20} />
            </div>
            <span>We will verify your details and get back to you</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="onboarding-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Didn't receive the email? Check your spam folder or <span className="onboarding-link">request a new link</span></p>
        </motion.div>
      </div>
    </motion.div>
  );
}