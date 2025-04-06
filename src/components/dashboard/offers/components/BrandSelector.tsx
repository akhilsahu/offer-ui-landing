import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { useToast } from '@/hooks/use-toast'; 
import { cn } from '@/lib/utils';
import { Store, BarChart2, MousePointer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandStatsCard } from '@/components/dashboard/brands/BrandStatsCard';

interface Brand {
  id: string;
  brand_name: string;
  is_verified: boolean;
  active_ads_count: number;
  total_clicks: number;
}

interface BrandSelectorProps {
  selectedBrand: string | 'all';
  onBrandSelect: (brandId: string | 'all') => void;
  refreshTrigger?: number;
}

export function BrandSelector({ selectedBrand, onBrandSelect, refreshTrigger = 0 }: BrandSelectorProps) {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle brand selection with debounce
  const handleBrandSelect = (brandName: string) => {
    // Throttle clicks to prevent accidental double-clicks
    const now = Date.now();
    if (now - lastClickTimeRef.current < 200) {
      return; // Ignore clicks that happen too quickly (within 200ms)
    }
    lastClickTimeRef.current = now;
    
    // Find the brand with the matching name
    let brandId: string | 'all' = 'all';
     
    if (brandName === "All Brands") {
      brandId = 'all';
    } else {
      const brand = brands.find(b => b.brand_name === brandName);
      if (brand) {
        brandId = brand.id;
      }
    }
    
    // Always call onBrandSelect even if it's the same brand to ensure refresh trigger is updated
    console.log(`Brand selected: ${brandName} (${brandId}), current selected: ${selectedBrand}`);
    onBrandSelect(brandId);
  };

  // Fetch brands data initially and when refreshTrigger changes
  useEffect(() => {
    console.log("BrandSelector: Fetching brands, refreshTrigger =", refreshTrigger);
    fetchBrands();
    
    // Setup scroll check listeners
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [refreshTrigger]);

  async function fetchBrands() {
    setLoading(true);
    try {
      // Add a cache busting parameter to prevent caching
      const url = `${BRAND_ENDPOINTS.list}?_t=${Date.now()}`;
      const response = await api.get(url);
      
      // Include all brands - both verified and unverified
      const brandsData = Array.isArray(response.data) 
        ? response.data 
        : [response.data].filter(Boolean);
        
      console.log("BrandSelector fetched brands:", brandsData);
      setBrands(brandsData);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load brands',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="min-w-[200px] h-24 rounded-xl bg-gray-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Calculate total active ads and clicks for "All Brands" option
  const totalActiveAds = brands.reduce((sum, b) => sum + (b.active_ads_count || 0), 0);
  const totalClicks = brands.reduce((sum, b) => sum + (b.total_clicks || 0), 0);

  return (
    <div className="relative group">
      <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {/* All Brands Option */}
        <div className="cursor-pointer">
          <BrandStatsCard
            brand_name="All Brands"
            active_ads_count={totalActiveAds}
            total_click={totalClicks}
            brand_image={undefined}
            isSelected={selectedBrand === 'all'}
            onSelect={handleBrandSelect}
          />
        </div>
    
        {/* Individual Brands */}
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="cursor-pointer"
          >
            <BrandStatsCard 
              brand_name={brand.brand_name}
              active_ads_count={brand.active_ads_count || 0}
              total_click={brand.total_clicks || 0}
              brand_image={undefined}
              isSelected={selectedBrand === brand.id}
              onSelect={handleBrandSelect}
              isVerified={brand.is_verified}
            />
          </div>
        ))}
      </div>
      
      {/* Scroll Arrows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}