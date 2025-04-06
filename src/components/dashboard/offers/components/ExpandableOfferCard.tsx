import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import '@/styles/ExpandableOfferCard.css';

interface OfferData {
  ad_name: string;
  brand_id: string;
  brand_name: string;
  category: string | null;
  coupon_code: string | null;
  created_at: string;
  created_by: string;
  details: string;
  id: string;
  image_url: string | null;
  is_active: boolean;
  landing_url: string;
  product_name: string;
  redemption_steps: string;
  tagline: string;
  tags: string[];
  tnc: string;
}

interface ExpandableOfferCardProps {
  isOpen: boolean;
  onClose: () => void;
  offerData: OfferData;
  fallbackImage: string;
}

export function ExpandableOfferCard({
  isOpen,
  onClose,
  offerData,
  fallbackImage
}: ExpandableOfferCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="expandable-card-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="expandable-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="expandable-card-close-button"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            {/* Header with Image */}
            <div className="expandable-card-header">
              <div className="expandable-card-header-gradient" />
              <img 
                src={offerData.image_url || fallbackImage} 
                alt={offerData.ad_name}
                className="w-full h-full object-cover" 
              />
              
              {/* Overlay Content */}
              <div className="expandable-card-header-content">
                {offerData.category && (
                  <span className="expandable-card-category">
                    {offerData.category}
                  </span>
                )}
                <h1 className="expandable-card-title">
                  {offerData.ad_name}
                </h1>
              </div>
            </div>
            
            {/* Content */}
            <div className="expandable-card-content">
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Brand</h2>
                <p className="text-white text-lg font-medium">{offerData.brand_name}</p>
              </div>
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Tagline</h2>
                <p className="text-white">{offerData.tagline}</p>
              </div>
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Tags</h2>
                <div className="flex flex-wrap">
                  {offerData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="expandable-card-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="expandable-card-divider" />
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Details</h2>
                <div className="expandable-card-box">
                  {offerData.details.split('\r\n').map((line, index) => (
                    <p key={index} className="text-white/90 text-sm mb-1">{line}</p>
                  ))}
                </div>
              </div>
              
              <div className="expandable-card-divider" />
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Redemption Steps</h2>
                <div className="expandable-card-box">
                  {offerData.redemption_steps.split('\r\n').map((step, index) => (
                    <p key={index} className="text-white/90 text-sm mb-1">{step}</p>
                  ))}
                </div>
              </div>
              
              <div className="expandable-card-divider" />
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Terms & Conditions</h2>
                <div className="expandable-card-box">
                  <p className="text-white/90 text-sm">{offerData.tnc}</p>
                </div>
              </div>
              
              <div className="expandable-card-divider" />
              
              <div className="expandable-card-section">
                <h2 className="expandable-card-section-title">Landing URL</h2>
                <a 
                  href={offerData.landing_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="expandable-card-link"
                >
                  {offerData.landing_url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            
            {/* Footer */}
            <div className="expandable-card-footer">
              <button
                onClick={() => window.open(offerData.landing_url, '_blank')}
                className="expandable-card-button"
              >
                Redeem Now
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}