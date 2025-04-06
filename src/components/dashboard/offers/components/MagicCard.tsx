import React, { useState } from 'react';
import { ExternalLink, Pencil, Trash2, Eye } from 'lucide-react';
import '@/styles/MagicCard.css';

 
interface MagicCardProps {
  ad_name: string;
  category: string;
  name: string;
  description: string;
  image_url: string;
  landing_url: string;
  clicks: number;
}

export function MagicCard({
  ad_name,
  category,
  name,
  description,
  image_url,
  landing_url,
  clicks,
}: MagicCardProps) {
  const [isActive, setIsActive] = useState(false);

  const handleRedeem = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(landing_url, '_blank');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add edit functionality
    console.log('Edit clicked for:', ad_name);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add delete functionality
    console.log('Delete clicked for:', ad_name);
  };

  const handleCardClick = () => {
    setIsActive(true);
  };

  return (
    <div
      className={`neon-card group relative w-full h-[280px] transition-all duration-500 hover:scale-[1.02] ${
        isActive ? 'active' : ''
      }`}
      onClick={handleCardClick}
      onMouseLeave={() => setIsActive(false)}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-[2px] rounded-2xl overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full text-gradient">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="relative h-full pt-6 flex flex-col justify-between">
        <div>
          <div className="px-6">
            <h3 className="text-sm text-white/80 mb-2">{ad_name}</h3>
            <h2 className="text-2xl font-bold text-gradient mb-2">
              {name}
            </h2>
            <p className="text-sm text-white/90 mb-4 line-clamp-2">{description}</p>
            <p className="text-base font-semibold flex items-center gap-2 flex-wrap relative">
              <span className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-lg -z-10" />
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-emerald-400">Clicked by</span>{' '}
              <span className="text-gradient-click font-bold">{clicks.toLocaleString()}</span>{' '}
              <span className="text-emerald-400">people so far</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full border-t border-white/10">
          <div className="flex-1 animated-gradient-button flex">
            <button
              onClick={handleRedeem}
              className="flex-1 flex items-center justify-center gap-2 text-white py-4 transition-all duration-300 hover:brightness-110"
            >
              Redeem Now
            </button>
            <div className="view-icon-divider"></div>
            <button
              onClick={handleRedeem}
              className="px-4 flex items-center justify-center text-white py-4 transition-all duration-300 hover:brightness-110"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 border-l border-white/10 animated-gradient-button ">
            <Pencil 
              className="w-4 h-4 text-green-400 cursor-pointer hover:scale-110 transition-transform" 
              onClick={handleEdit}
            />
            <Trash2 
              className="w-4 h-4 text-red-400 cursor-pointer hover:scale-110 transition-transform" 
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}