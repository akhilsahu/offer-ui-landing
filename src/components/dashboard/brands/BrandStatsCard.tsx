import React, { useState } from 'react';
import '@/styles/BrandStatsCard.css';

interface BrandStatsCardProps {
  brand_name: string;
  active_ads_count: number;
  total_click: number;
  brand_image?: string;
  isSelected?: boolean;
  isVerified?: boolean;
  onSelect?: (brand_name: string) => void;
}

export function BrandStatsCard({
  brand_name,
  active_ads_count,
  total_click,
  brand_image,
  isSelected = false,
  isVerified = true,
  onSelect
}: BrandStatsCardProps) {
  // Get first letter of brand name for fallback
  const brandInitial = brand_name.charAt(0);
  
  // Local state to handle selection if no external control is provided
  const [localSelected, setLocalSelected] = useState(false);
  
  // Determine if the card is selected (controlled or uncontrolled)
  const selected = onSelect ? isSelected : localSelected;
  
  // Handle click on the card
  const handleClick = () => {
    if (onSelect) {
      // Controlled component
      onSelect(brand_name);
    } else {
      // Uncontrolled component
      setLocalSelected(!localSelected);
    }
  };

  return (
    <div 
      className={`brand-stats-card w-40 p-2 ${selected ? 'selected' : ''} ${!isVerified ? 'unverified' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {/* Brand Image or Initial */}
        <div className="brand-image-container flex-shrink-0">
          {brand_image ? (
            <img 
              src={brand_image} 
              alt={brand_name} 
              className="brand-image"
            />
          ) : (
            <span className="brand-initial">{brandInitial}</span>
          )}
        </div>
        
        {/* Brand Name - Directly aligned with image */}
        <h3 className="brand-name text-xs font-bold truncate max-w-[90px]">
          {brand_name}
        </h3>
      </div>
      
      {/* Stats Section - More compact layout */}
      <div className="flex items-center justify-between mt-1.5">
        {/* Active Ads Count */}
        <div className="flex flex-col">
          <span className="stats-number">{active_ads_count}</span>
          <span className="stats-label">offers</span>
        </div>
        
        {/* Click Count - Smaller and more compact */}
        <div className="click-badge">
          <span className="click-dot"></span>
          <span className="click-count">{total_click.toLocaleString()}</span>
        </div>
      </div>

      {/* Verification status indicator for unverified brands */}
      {!isVerified && (
        <div className="verification-badge">
          Verification Pending
        </div>
      )}
    </div>
  );
}