import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  app_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface Brand {
  id: string;
  brand_name: string;
  website: string;
  app_link: string;
  logo_url?: string;
}

interface EditBrandModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBrandModal({
  brand,
  isOpen,
  onClose,
}: EditBrandModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.brand_name,
      website: brand.website,
      app_link: brand.app_link,
      logo_url: brand.logo_url,
    },
  });

  // Update form values when brand changes
  useEffect(() => {
    reset({
      name: brand.brand_name,
      website: brand.website,
      app_link: brand.app_link,
      logo_url: brand.logo_url,
    });
  }, [brand, reset]);

  const onSubmit = async (data: z.infer<typeof brandSchema>) => {
    setLoading(true);
    try {
      const response = await api.put(BRAND_ENDPOINTS.update(brand.id), {
        brand_name: data.name,
        website: data.website,
        app_link: data.app_link,
        logo_url: data.logo_url
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Update your brand's information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter brand name"
              className="bg-gray-900/50"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://example.com"
              className="bg-gray-900/50"
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_link">App Link</Label>
            <Input
              id="app_link"
              {...register('app_link')}
              placeholder="https://play.google.com/store/apps/your-app"
              className="bg-gray-900/50"
            />
            {errors.app_link && (
              <p className="text-sm text-red-500">{errors.app_link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              {...register('logo_url')}
              placeholder="https://example.com/logo.png"
              className="bg-gray-900/50"
            />
            {errors.logo_url && (
              <p className="text-sm text-red-500">{errors.logo_url.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? 'Updating...' : 'Update Brand'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}