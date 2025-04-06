import React, { useState } from 'react';
import { ExternalLink, Pencil, Eye, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import '@/styles/MagicCard.css';
import { api } from '@/lib/axios';
import { ADS_ENDPOINTS } from '@/lib/config/endpoints';
import { useToast } from '@/hooks/use-toast';

import { ExpandableOfferCard } from './ExpandableOfferCard';
import { EditOfferModal } from './EditOfferModal';

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

interface MagicMixCardProps {
  brand_name: string;
  category: string;
  ad_name: string;
  tagline: string;
  image_url: string;
  landing_url: string;
  clicks: number;
  offerData?: OfferData;
  onRefresh?: () => void; // New callback prop for refreshing the parent
}

export function MagicMixCard({
  brand_name,
  category,
  ad_name,
  tagline,
  image_url,
  landing_url,
  clicks,
  offerData = {
    ad_name: "30% off on anything",
    brand_id: "d6446263-7da1-464a-84da-25cfaed0c17b",
    brand_name: "Cool Brand",
    category: null,
    coupon_code: null,
    created_at: "2025-03-13T20:08:11.950797",
    created_by: "80ea098d-b324-4ac2-ad69-23473ebc4978",
    details: "1. Offer valid on the iphone 13 only\r\n2. Offer is on the anything ordered across all the product\r\n3. Gold product are excluded\r\n4. The max capping for discount is upto 1000",
    id: "eabbe36c-8c1f-4bae-b37e-b922f4fd1681",
    image_url: null,
    is_active: true,
    landing_url: "https://www.nike.com/in/t/air-max-dn8-shoes-5hKVxC/FQ7860-800",
    product_name: "All Product Categories",
    redemption_steps: "1. Visit the website\r\n2. The offer will be auto applied when accessed via the link\r\n3. Offer valid on the iphone 13 only\r\n4. Offer is on the anything ordered across all the product\r\n5. Gold product are excluded\r\n6. The max capping for discount is upto 1000",
    tagline: "Styles you cant refude",
    tags: ['HRX,Footwear'],
    tnc: "Refer to https://magicui.design/docs/components/safari"
  },
  onRefresh
}: MagicMixCardProps) {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(offerData?.is_active || false);
  const [isTogglingState, setIsTogglingState] = useState(false);

  const handleRedeem = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(landing_url, '_blank');
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple clicks while request is in progress
    if (isTogglingState) return;
    
    setIsTogglingState(true);
    
    try {
      const response = await api.put(ADS_ENDPOINTS.toggleAd(offerData.id));
      
      // Update local state with the new status
      setIsToggled(!isToggled);
      
      // Show success message to the user
      toast({
        title: 'Success',
        description: isToggled 
          ? 'Ad deactivated successfully' 
          : 'Ad activated successfully',
      });
      
      // Trigger refresh of the parent list
      if (onRefresh) {
        onRefresh();
      }
      
      console.log('Ad status updated:', response.data);
    } catch (error: any) {
      // Show error message to the user
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update ad status',
      });
      
      console.error('Error toggling ad status:', error);
    } finally {
      setIsTogglingState(false);
    }
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };
  
  const handleEditSuccess = () => {
    toast({
      title: 'Success',
      description: 'Offer updated successfully!'
    });
    
    // Trigger refresh in the parent component
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <div
        className={`neon-card group relative w-full transition-all duration-500 hover:scale-[1.02] ${
          isActive ? 'active' : ''
        }`}
        onClick={() => setIsActive(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Image Section */}
        <div className="relative h-[150px] rounded-t-2xl overflow-hidden border-2 border-gray-800">
          <img
            src={image_url}
            alt={ad_name}
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-30">
            <span className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full text-gradient">
              {category}
            </span>
          </div>
          
          {/* Brand Name at Bottom of Image with Clicks */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/50 backdrop-blur-sm z-30 flex justify-between items-center">
            <h3 className="text-sm text-white/90 font-medium truncate mr-2">{brand_name}</h3>
            <div className="text-sm flex items-center gap-1 whitespace-nowrap">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-emerald-400">Clicks:</span>{' '}
              <span className="text-gradient-purple font-bold text-sm">{clicks.toLocaleString()}</span>{' '}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-b-2xl border-x-2 border-b-2 border-gray-800">
          {/* Card info with padding */}
          <div className="px-5 pt-3 pb-3">          
            <h2 className="text-xl font-bold text-gradient mb-1 truncate">
              {ad_name}
            </h2>
            <p className="text-xs text-white/90 mb-3 h-8 line-clamp-2 overflow-hidden" title={tagline}>
              {tagline}
            </p>
          </div>

          {/* Action Buttons Section - No horizontal padding */}
          <div className="w-full border-t border-white/10">
            {/* CTA Buttons - Full Width */}
            <div className="w-full animated-gradient-button flex rounded-b-2xl overflow-hidden">
              <button
                onClick={handleRedeem}
                className="w-[50%] flex items-center justify-center gap-1 text-white py-2 text-xs transition-all duration-300 hover:brightness-110 border-r border-white/10"
              >
                Redeem Now
              </button>
              <button
                onClick={handleViewClick}
                className="w-[15%] flex items-center justify-center text-white py-2 transition-all duration-300 hover:brightness-110 border-r border-white/10"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="w-[15%] flex items-center justify-center py-2 transition-all duration-300 hover:brightness-110 border-r border-white/10"
                onClick={handleEditClick}
              >
                <Pencil className="w-4 h-4 text-green-400 hover:scale-110 transition-transform" />
              </button>
              <button 
                className="w-[20%] flex items-center justify-center py-2 transition-all duration-300 hover:brightness-110"
                onClick={handleToggle}
                disabled={isTogglingState}
              >
                {isTogglingState ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isToggled ? (
                  <ToggleRight className="w-6 h-6 text-green-400 hover:scale-110 transition-transform" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400 hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Card Component */}
      <ExpandableOfferCard 
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        offerData={offerData}
        fallbackImage={image_url}
      />
      
      {/* Edit Offer Modal */}
      <EditOfferModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        offerData={offerData}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}