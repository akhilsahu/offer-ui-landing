import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/AuthForm';

export function RegisterScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-md mx-auto p-6"
    >
      <AuthForm />
    </motion.div>
  );
}