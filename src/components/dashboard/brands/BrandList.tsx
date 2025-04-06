import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditBrandModal } from './EditBrandModal';
import { DeleteBrandModal } from './DeleteBrandModal';
import { ViewAdsModal } from './ViewAdsModal';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart2,
  Edit2,
  ExternalLink,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Brand {
  id: string;
  brand_name: string;
  website: string;
  app_link: string;
  is_verified: boolean;
}

interface BrandListProps {
  searchQuery: string;
  refreshTrigger: number;
}

export function BrandList({ searchQuery, refreshTrigger }: BrandListProps) {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewAdsModalOpen, setIsViewAdsModalOpen] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [refreshTrigger]);

  async function fetchBrands() {
    try {
      const response = await api.get(BRAND_ENDPOINTS.list);
      // Ensure we handle both single brand and array responses
      const brandData = response.data;
      setBrands(Array.isArray(brandData) ? brandData : [brandData].filter(Boolean));
      console.log(response.data)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load brands',
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredBrands = brands.filter(brand =>
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort brands: verified first, then unverified
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    if (a.is_verified && !b.is_verified) return -1;
    if (!a.is_verified && b.is_verified) return 1;
    return 0;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 animate-pulse"
          >
            <div className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "p-8 relative overflow-hidden backdrop-blur-sm border border-white/10 min-h-[180px]",
                  "bg-gradient-to-br from-gray-900/80 to-gray-800/80",
                  brand.is_verified && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-blue-500/10 before:to-pink-500/10",
                  brand.is_verified && "after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/[0.03] after:to-transparent",
                  !brand.is_verified && "opacity-80 hover:opacity-100 transition-opacity duration-200",
                  brand.is_verified && "cursor-pointer hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                )}
                onClick={(e: React.MouseEvent) => {
                  // Don't open ads modal if clicking on dropdown
                  const isDropdownClick = (e.target as HTMLElement).closest('[role="menuitem"]');
                  if (isDropdownClick) {
                    e.stopPropagation();
                    return;
                  }
                  // Only open ads modal if clicking outside dropdown
                  const isDropdownTrigger = (e.target as HTMLElement).closest('[role="button"]');
                  if (isDropdownTrigger) {
                    e.stopPropagation();
                    return;
                  }
                  if (brand.is_verified) {
                    setSelectedBrand(brand);
                    setIsViewAdsModalOpen(true);
                  }
                }}
              >
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-sm">
                        {brand.brand_name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{brand.brand_name}</h3>
                      <div className="flex gap-2">
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            WEB
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {brand.app_link && (
                          <a
                            href={brand.app_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                          >
                            APP
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost" 
                          size="icon"
                          data-dropdown-trigger="true"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-[160px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBrand(brand);
                            setIsViewAdsModalOpen(true);
                          }}
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          View Ads
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBrand(brand);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit Brand
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => {
                            setSelectedBrand(brand);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Brand
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                   {!brand.is_verified && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-yellow-700/10 text-xs font-medium text-yellow-400 animate-pulse">
                    Verification in progress
                  </div>
                )}
                {brand.is_verified && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-purple-400">
                    <span>Click to view ads</span>
                    <BarChart2 className="h-3 w-3" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedBrand && (
        <>
          <EditBrandModal
            brand={selectedBrand}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedBrand(null);
              fetchBrands();
            }}
          />
          <DeleteBrandModal
            brand={selectedBrand}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedBrand(null);
              fetchBrands();
            }}
          />
          <ViewAdsModal
            brand={selectedBrand}
            isOpen={isViewAdsModalOpen}
            onClose={() => {
              setIsViewAdsModalOpen(false);
              setSelectedBrand(null);
            }}
          />
        </>
      )}
    </>
  );
}