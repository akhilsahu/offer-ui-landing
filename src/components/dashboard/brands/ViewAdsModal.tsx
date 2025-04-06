import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { BarChart2 } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
}

interface Ad {
  id: string;
  name: string;
  type: string;
  category: string;
  is_active: boolean;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface ViewAdsModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewAdsModal({ brand, isOpen, onClose }: ViewAdsModalProps) {
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAds();
    }
  }, [isOpen, brand.id]);

  async function fetchAds() {
    try {
      const response = await api.get(BRAND_ENDPOINTS.ads(brand.id));
      setAds(response.data.ads || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load ads',
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdStatus(adId: string, currentStatus: boolean) {
    try {
      const response = await api.put(BRAND_ENDPOINTS.toggleAd(adId), {
        is_active: !currentStatus
      });

      setAds(ads.map(ad =>
        ad.id === adId ? { ...ad, is_active: !currentStatus } : ad
      ));

      toast({
        title: 'Success',
        description: `Ad ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            {brand.name}'s Ads
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="p-4 animate-pulse bg-gray-900/50"
              >
                <div className="h-20" />
              </Card>
            ))
          ) : ads.length === 0 ? (
            <p className="text-center text-gray-400">No ads found for this brand.</p>
          ) : (
            ads.map((ad) => (
              <Card
                key={ad.id}
                className="p-4 bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{ad.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{ad.type}</Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 text-purple-400 border-purple-500/20"
                      >
                        {ad.category}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={ad.is_active}
                    onCheckedChange={() => toggleAdStatus(ad.id, ad.is_active)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-400">Clicks</p>
                    <p className="text-lg font-semibold">{ad.clicks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Conversions</p>
                    <p className="text-lg font-semibold">{ad.conversions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-lg font-semibold">${ad.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}