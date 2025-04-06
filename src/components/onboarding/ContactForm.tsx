import { useState } from 'react';
import { motion } from 'framer-motion';
import '@/styles/ContactForm.css';

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    question: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setIsSubmitted(true);
      
      // Clear form
      setFormData({
        question: '',
        message: '',
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      {isSubmitted ? (
        <motion.div 
          className="contact-form-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact-form-success-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Thank you for reaching out!</h3>
          <p>We've received your message and will get back to you soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-field">
            <label htmlFor="question">Question Topic</label>
            <input
              type="text"
              id="question"
              name="question"
              placeholder="E.g., Account Verification, Onboarding Status"
              value={formData.question}
              onChange={handleChange}
              required
              className="contact-form-input"
            />
          </div>
          
          <div className="contact-form-field">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Please describe your question or concern in detail..."
              value={formData.message}
              onChange={handleChange}
              required
              className="contact-form-textarea"
              rows={5}
            />
          </div>
          
          {error && <div className="contact-form-error">{error}</div>}
          
          <button 
            type="submit" 
            className="contact-form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="contact-form-loading">
                <div className="contact-form-loading-spinner"></div>
                Sending...
              </div>
            ) : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}