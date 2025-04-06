import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import '@/styles/LoginScreen.css';

export function LoginScreen() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="login-screen-container">
      <div className="login-screen-bg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="login-screen-shape"
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

      <div className="login-screen-content">
        <motion.div
          className="login-screen-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-screen-logo-container">
            <img 
              src="/assets/logo.jpg" 
              alt="Logo" 
              className="login-screen-logo"
            />
          </div>

          <h1 className="login-screen-title">Welcome Back</h1>
          <p className="login-screen-subtitle">Sign in to continue</p>

          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}