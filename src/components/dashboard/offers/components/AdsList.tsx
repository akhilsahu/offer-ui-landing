import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { ADS_ENDPOINTS } from '@/lib/config/endpoints';
import { MagicMixCard } from './MagicMixCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from './DateRangePicker';


interface Ad {
  id: string;
  brand_id: string;
  brand_name: string;
  ad_name: string;
  coupon_code: string;
  category: string;
  product_name: string;
  tags: string[];
  details: string;
  redemption_steps: string;
  tnc: string;
  tagline: string;
  click_count:string;
  image_url: string;
  landing_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

interface AdsResponse {
  ads: Ad[];
  total: number;
  page: number;
  per_page: number;
}

interface AdsListProps {
  selectedBrand: string | 'all';
  refreshTrigger?: number;
  filter?: 'all' | 'active' | 'ended';
  onFilterChange?: (filter: 'all' | 'active' | 'ended') => void;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

export function AdsList({ 
  selectedBrand, 
  refreshTrigger = 0,
  filter = 'all',
  onFilterChange,
  dateRange = { from: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), to: new Date() },
  onDateRangeChange
}: AdsListProps) {
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const requestInProgress = useRef(false);
  
  const lastAdElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // This effect handles brand selection changes, filter changes, date range changes, and refresh trigger
  useEffect(() => {
    console.log("Brand, filter, date range, or refresh trigger changed:", { 
      selectedBrand, 
      filter, 
      dateRange,
      refreshTrigger,
      localRefreshTrigger
    });
    
    // Always reset state when any of these change
    setAds([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    requestInProgress.current = false;
    
    // Explicitly fetch ads immediately
    fetchAds(1);
  }, [selectedBrand, refreshTrigger, filter, dateRange, localRefreshTrigger]);
  
  // This effect handles pagination for infinite scroll
  useEffect(() => {
    if (page > 1) {
      fetchAds(page);
    }
  }, [page]);

  // Function to handle refreshing from child components
  const handleRefresh = useCallback(() => {
    console.log("Refreshing ads list from child component");
    setLocalRefreshTrigger(prev => prev + 1);
  }, []);

  // Pass page parameter to ensure we're using the right page number
  async function fetchAds(currentPage: number) {
    // Skip if a request is already in progress to prevent race conditions
    if (requestInProgress.current) {
      console.log("Skipping fetch - request already in progress");
      return;
    }
    
    // Track that a request is in progress
    requestInProgress.current = true;
    setLoading(true);
    
    try {
      let url = `${ADS_ENDPOINTS.list}?page=${currentPage}&per_page=12`;
      
      // Add brand filter if not "all"
      if (selectedBrand !== 'all') {
        url += `&brand_id=${selectedBrand}`;
      }

      // Add active/ended filter
      if (filter === 'active') {
        url += `&is_active=true`;
      } else if (filter === 'ended') {
        url += `&is_active=false`;
      }
        console.log(dateRange)
      // Add date range filter
      if (dateRange) {
        url += `&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`;
      }

      // Add cache busting parameter to prevent caching
      url += `&_t=${Date.now()}`;
        
      console.log("Fetching ads from URL:", url, "for brand:", selectedBrand);
      const { data } = await api.get<AdsResponse>(url);
       
      
      if (data.ads.length === 0) {
        setHasMore(false);
      } else {
        setAds(prevAds => {
          if (currentPage === 1) {
            // On first page load, replace all ads
            return [...data.ads];
          } else {
            // For subsequent pages, append new ads (avoiding duplicates)
            const newAds = data.ads.filter(
              newAd => !prevAds.some(existingAd => existingAd.id === newAd.id)
            );
            return [...prevAds, ...newAds];
          }
        });
        setHasMore(data.page * data.per_page < data.total);
      }
      
    } catch (error: any) {
      console.error('Error fetching ads:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load ads',
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
      requestInProgress.current = false;
    }
  }

  if (ads.length === 0 && initialLoading) {
    return (
      <div className="mt-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-lg">Loading ads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => onFilterChange && onFilterChange('all')}
          >
            All Offers
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => onFilterChange && onFilterChange('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'ended' ? 'default' : 'outline'}
            onClick={() => onFilterChange && onFilterChange('ended')}
          >
            Ended
          </Button>
        </div>
        
        {/* Date Range Picker */}
        {onDateRangeChange && (
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        )}
      </div>

      {/* Available Offers Section Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold text-gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
          Available Offers
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent ml-4"></div>
      </div>

      {/* No Offers Message */}
      {ads.length === 0 && !loading && (
        <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">No Ads Found</h3>
          <p className="text-muted-foreground">
            {selectedBrand === 'all' 
              ? 'No ads match the current filter criteria.' 
              : 'This brand does not have any ads matching the current filters.'}
          </p>
        </div>
      )}

      {/* Grid of Offer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {ads.map((ad, index) => {
            if (ads.length === index + 1) {
              return (
                <div ref={lastAdElementRef} key={ad.id} className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full"
                  >
                    <MagicMixCard
                      brand_name={ad.brand_name}
                      ad_name={ad.ad_name}
                      category={ad.category || ''}
                      tagline={ad.tagline}
                      name={ad.product_name}
                      description={ad.tagline}
                      image_url={ad.image_url || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"}
                      landing_url={ad.landing_url}
                      clicks={ad.click_count} // Random for demo
                      offerData={ad}
                      onRefresh={handleRefresh}
                    />
                  </motion.div>
                </div>
              );
            } else {
              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full"
                >
                  <MagicMixCard
                    brand_name={ad.brand_name}
                    ad_name={ad.ad_name}
                    category={ad.category || ''}
                    tagline={ad.tagline}
                    name={ad.product_name}
                    description={ad.tagline}
                    image_url={ad.image_url || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"}
                    landing_url={ad.landing_url}
                    clicks={ad.click_count} // Random for demo
                    offerData={ad}
                    onRefresh={handleRefresh}
                  />
                </motion.div>
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* Loading more indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="ml-2">Loading more...</span>
        </div>
      )}
    </div>
  );
}