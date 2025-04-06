import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { X, Loader2, AlertCircle } from 'lucide-react';

const offerSchema = z.object({
  brand_id: z.string().min(1, 'Please select a brand'),
  ad_name: z.string().min(2, 'Ad name must be at least 2 characters').transform(val => val.trim()),
  product_name: z.string().min(2, 'Product name must be at least 2 characters').transform(val => val.trim()),
  tags: z.string().transform((str) => str.split(',').map(tag => tag.trim()).filter(tag => tag !== '')),
  details: z.string().min(10, 'Details must be at least 10 characters').transform(val => val.trim()),
  redemption_steps: z.string().min(10, 'Redemption steps must be at least 10 characters').transform(val => val.trim()),
  tnc: z.string().min(10, 'Terms and conditions must be at least 10 characters').transform(val => val.trim()),
  tagline: z.string().max(200, 'Tagline must be less than 200 words').transform(val => val.trim()),
  image: z.instanceof(File).optional(),
  landing_url: z.string().url('Must be a valid URL').transform(val => val.trim()),
});

interface Brand {
  id: string;
  brand_name: string;
}

interface AddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBrand: string | 'all';
  onSuccess?: () => void;
}

const DEFAULT_REDEMPTION_STEPS = "1. Visit the website\n2. The offer will be auto applied when accessed via the link\n3. Offer valid on the iphone 13 only\n4. Offer is on the anything ordered across all the product\n5. Gold product are excluded\n6. The max capping for discount is upto 1000";

const DEFAULT_DETAILS = "1. Offer valid on the iphone 13 only\n2. Offer is on the anything ordered across all the product\n3. Gold product are excluded\n4. The max capping for discount is upto 1000";

function AddOfferModalComponent({ isOpen, onClose, selectedBrand, onSuccess }: AddOfferModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      brand_id: selectedBrand !== 'all' ? selectedBrand : '',
      tags: '',
      ad_name: '',
      product_name: '',
      details: DEFAULT_DETAILS,
      redemption_steps: DEFAULT_REDEMPTION_STEPS,
      tnc: '',
      tagline: '',
      landing_url: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset form when modal is closed
    if (!isOpen) {
      reset({
        brand_id: selectedBrand !== 'all' ? selectedBrand : '',
        tags: '',
        ad_name: '',
        product_name: '',
        details: DEFAULT_DETAILS,
        redemption_steps: DEFAULT_REDEMPTION_STEPS,
        tnc: '',
        tagline: '',
        landing_url: ''
      });
      setTags([]);
      setCurrentTag('');
      setBrandsError(null);
    }
  }, [isOpen, reset, selectedBrand]);

  const fetchBrands = async () => {
    setIsBrandsLoading(true);
    setBrandsError(null);
    try {
      const response = await api.get(BRAND_ENDPOINTS.list);
      setBrands(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Failed to fetch brands:", error);
      setBrandsError('Failed to load brands: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load brands',
      });
    } finally {
      setIsBrandsLoading(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentTag.trim()) {
        const newTags = [...tags, currentTag.trim()];
        setTags(newTags);
        setValue('tags', newTags.join(','));
        setCurrentTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags.join(','));
  };

  const onSubmit = async (data: z.infer<typeof offerSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, value.join(','));
          } else {
            formData.append(key, value);
          }
        }
      });

      await api.post(BRAND_ENDPOINTS.ads.create, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Success',
        description: 'Offer created successfully',
      });

      reset();
      setTags([]);
      setCurrentTag('');
      
      // Make sure to call onSuccess before closing the modal
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create offer',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while brands are loading
  if (isBrandsLoading && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] relative overflow-hidden border-gray-800 max-h-[95vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
            <p className="text-lg font-medium">Loading brands...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state if brands failed to load
  if (brandsError && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] relative overflow-hidden border-gray-800 max-h-[95vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-red-400">Failed to load brands</p>
              <p className="text-sm text-gray-400">{brandsError}</p>
            </div>
            <Button onClick={fetchBrands} variant="outline">
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] relative overflow-hidden border-gray-800 max-h-[95vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-blue-900/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="relative z-10">
        <DialogHeader className="pb-2">
          <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 text-lg">
            Create New Offer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {selectedBrand === 'all' && (
              <div className="space-y-1">
                <Label className="text-xs">Select Brand</Label>
                <Select
                  onValueChange={(value) => setValue('brand_id', value)}
                  defaultValue={watch('brand_id')}
                >
                  <SelectTrigger className="magic-select-trigger h-8">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.brand_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand_id && (
                  <p className="text-xs text-red-500">{errors.brand_id.message}</p>
                )}
              </div>
            )}
            
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">What's the offer?</Label>
              <Input {...register('ad_name')} placeholder="40% off 300 cashback Sale" className="magic-input h-8 text-sm" />
              {errors.ad_name && (
                <p className="text-xs text-red-500">{errors.ad_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tagline</Label>
            <Input
              {...register('tagline')}
              placeholder="Anything short but catchy: An offer you cant refuse"
              className="magic-input h-8 text-sm"
            />
            {errors.tagline && (
              <p className="text-xs text-red-500">{errors.tagline.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tags</Label>
            <div className="flex flex-wrap gap-1 mb-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-purple-500/20 rounded-full flex items-center gap-1 text-xs"
                >
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="magic-input h-8 text-sm"
              placeholder="Type and press Enter to add tags like headphones, electronics"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Details(Some exciting details on offers)</Label>
            <Textarea
              {...register('details')}
              placeholder="Detailed information about the offer"
              className="h-16 magic-textarea text-sm"
              defaultValue={DEFAULT_DETAILS}
            />
            {errors.details && (
              <p className="text-xs text-red-500">{errors.details.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Redemption Steps(How to Grab the offer)</Label>
            <Textarea
              {...register('redemption_steps')}
              placeholder="Steps to redeem the offer"
              className="h-16 magic-textarea text-sm"
              defaultValue={DEFAULT_REDEMPTION_STEPS}
            />
            {errors.redemption_steps && (
              <p className="text-xs text-red-500">{errors.redemption_steps.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Terms and Conditions[Add a link which takes to tnc about the offer or brand]</Label>
            <Input
              {...register('tnc')}
              placeholder="Refer: link to tnC of the offer"
              className="magic-input h-8 text-sm"
            />
            {errors.tnc && (
              <p className="text-xs text-red-500">{errors.tnc.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Cool Image</Label>
              <Input
                type="file"
                accept="image/*"
                className="magic-input h-8 text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue('image', file);
                }}
              />
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Landing URL</Label>
              <Input
                {...register('landing_url')}
                placeholder="https://example.com/offer"
                className="magic-input h-8 text-sm"
              />
              {errors.landing_url && (
                <p className="text-xs text-red-500">{errors.landing_url.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Product Name</Label>
            <Input 
              {...register('product_name')} 
              placeholder="Store Wide or Premium Headphones" 
              className="magic-input h-8 text-sm" 
            />
            {errors.product_name && (
              <p className="text-xs text-red-500">{errors.product_name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="border-purple-500/20 hover:bg-purple-500/10 transition-colors duration-300 backdrop-blur-sm h-8 text-xs"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="magic-border bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm h-8 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : 'Create Offer'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const AddOfferModal = AddOfferModalComponent;