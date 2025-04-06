import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DateRangePicker } from './DateRangePicker';
 
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart2,
  Edit2,
  Trash2,
  MousePointer,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Offer {
  id: string;
  name: string;
  brand_name: string;
  brand_logo: string;
  clicks: number;
  redemptions: number;
  is_active: boolean;
}

interface OffersListProps {
  selectedBrand: string | 'all';
  filter: 'all' | 'active' | 'ended';
  onFilterChange: (filter: 'all' | 'active' | 'ended') => void;
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function OffersList({ 
  selectedBrand, 
  filter, 
  onFilterChange,
  dateRange,
  onDateRangeChange
}: OffersListProps) {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [selectedBrand, filter, dateRange]);

  async function fetchOffers() {
    try {
      // In a real app, this would fetch from your API
      // For now, using mock data
      setOffers([
        {
          id: '1',
          name: 'Summer Sale 2025',
          brand_name: 'Fashion Brand',
          brand_logo: '',
          clicks: 1200,
          redemptions: 600,
          is_active: true,
        },
        {
          id: '2',
          name: 'Flash Deal',
          brand_name: 'Tech Store',
          brand_logo: '',
          clicks: 800,
          redemptions: 400,
          is_active: true,
        },
        {
          id: '3',
          name: 'Special Offer',
          brand_name: 'Food Chain',
          brand_logo: '',
          clicks: 600,
          redemptions: 300,
          is_active: false,
        },
      ]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load offers',
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleOfferStatus(offerId: string, currentStatus: boolean) {
    try {
      // In a real app, this would call your API
      setOffers(offers.map(offer =>
        offer.id === offerId ? { ...offer, is_active: !currentStatus } : offer
      ));

      toast({
        title: 'Success',
        description: `Offer ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update offer status',
      });
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="w-full h-32 animate-pulse bg-gray-800/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters - now with DateRangePicker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => onFilterChange('all')}
          >
            All Offers
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => onFilterChange('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'ended' ? 'default' : 'outline'}
            onClick={() => onFilterChange('ended')}
          >
            Ended
          </Button>
        </div>
        
        {/* Date Range Picker - Moved here from MyOffersScreen */}
        <DateRangePicker 
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cn(
                "p-6 bg-gradient-to-br backdrop-blur-sm border-white/10",
                "from-gray-900/50 to-gray-800/50",
                offer.is_active && "hover:border-purple-500/50 transition-all duration-200"
              )}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Store className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{offer.name}</h3>
                      <p className="text-sm text-gray-400">{offer.brand_name}</p>
                    </div>
                  </div>
                  <Switch
                    checked={offer.is_active}
                    onCheckedChange={() => toggleOfferStatus(offer.id, offer.is_active)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MousePointer className="h-4 w-4" />
                      <span>Total Clicks</span>
                    </div>
                    <p className="text-xl font-semibold">{offer.clicks}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Redemptions</span>
                    </div>
                    <p className="text-xl font-semibold">{offer.redemptions}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}