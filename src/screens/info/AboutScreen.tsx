import { motion } from 'framer-motion';
import { Info, Users, Target, Zap, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import '@/styles/InfoPages.css';

export function AboutScreen() {
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
          <Info className="info-page-icon" />
          <h1>About Us</h1>
          <p>Connecting Brands with Their Audience</p>
        </motion.div>

        <div className="info-page-sections">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="info-section about-section"
          >
            <Users className="section-icon" />
            <h2>Who We Are</h2>
            <p>We are a dynamic team of innovators and marketing experts dedicated to revolutionizing the way brands connect with their audience. Our platform brings together advertisers and content creators in a seamless, efficient ecosystem.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="info-section about-section"
          >
            <Target className="section-icon" />
            <h2>Our Mission</h2>
            <p>Our mission is to create meaningful connections between brands and their target audience through authentic content creators. We believe in transparent, measurable, and effective advertising that benefits everyone involved.</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="info-section about-section"
          >
            <Zap className="section-icon" />
            <h2>What Sets Us Apart</h2>
            <p>We combine cutting-edge technology with deep industry expertise to deliver a platform that's both powerful and easy to use. Our innovative approach to ad tracking and analytics ensures that every campaign delivers measurable results.</p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}