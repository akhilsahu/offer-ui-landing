import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import '@/styles/InfoPages.css';

export function PrivacyPolicyScreen() {
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
          <Shield className="info-page-icon" />
          <h1>Privacy Policy</h1>
          <p>Last updated: March 15, 2025</p>
        </motion.div>

        <div className="info-page-sections">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="info-section"
          >
            <Lock className="section-icon" />
            <h2>Data Collection and Usage</h2>
            <p>We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide. This information is used to provide and improve our services, communicate with you, and ensure the security of our platform.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="info-section"
          >
            <Eye className="section-icon" />
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as these parties agree to keep this information confidential.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="info-section"
          >
            <UserCheck className="section-icon" />
            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. You can also object to our processing of your personal information or request that we transfer your information to another service provider.</p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}