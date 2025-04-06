import { motion } from 'framer-motion';
import { ScrollText, FileCheck, AlertCircle, Scale, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import '@/styles/InfoPages.css';

export function TermsScreen() {
  const navigate = useNavigate();

  return (
    <div className="info-page-container">
      <div className="info-page-gradient"></div>
      
      {/* Navigation Buttons */}
      <div className="info-page-nav">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="info-nav-button"
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="info-nav-button"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>
      
      <div className="info-page-bg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="info-page-shape"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
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

      <div className="info-page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="info-page-header"
        >
          <ScrollText className="info-page-icon" />
          <h1>Terms and Conditions</h1>
          <p>Effective from: March 15, 2025</p>
        </motion.div>

        <div className="info-page-sections">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="info-section"
          >
            <FileCheck className="section-icon" />
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this platform's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="info-section"
          >
            <AlertCircle className="section-icon" />
            <h2>User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="info-section"
          >
            <Scale className="section-icon" />
            <h2>Limitation of Liability</h2>
            <p>We shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.</p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}