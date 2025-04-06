import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Mail, Home, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import '@/styles/InfoPages.css';

export function ContactScreen() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <MessageSquare className="info-page-icon" />
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="contact-form-container"
        >
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">
                <User className="form-icon" />
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
                className="contact-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail className="form-icon" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="contact-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                <MessageSquare className="form-icon" />
                Message
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help?"
                required
                className="contact-textarea"
                rows={5}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="contact-submit-button"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}