import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import '@/styles/Onboarding.css';
import { Button } from '@/components/ui/button';
import { OnboardingVerification } from '@/components/onboarding/OnboardingVerification';

export function OnboardingVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  
  useEffect(() => {
    // Get email from localStorage or location state
    const storedEmail = localStorage.getItem('user_email');
    const stateEmail = location.state?.email;
    
    if (stateEmail) {
      setEmail(stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location]);

  return (
    <div className="onboarding-container">
      <div className="onboarding-gradient"></div>
      
      {/* Animated background elements */}
      <div className="onboarding-bg-elements">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="onboarding-bg-shape"
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
      
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="onboarding-back-button" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      {/* Main content */}
      <div className="onboarding-content">
        <OnboardingVerification email={email} />
      </div>
    </div>
  );
}