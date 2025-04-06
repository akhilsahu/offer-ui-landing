import { useState } from 'react';
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
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { useNavigate } from 'react-router-dom';

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  app_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddBrandModal({ isOpen, onClose, onSuccess }: AddBrandModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
  });

  const onSubmit = async (data: z.infer<typeof brandSchema>) => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await api.post(BRAND_ENDPOINTS.create, {
        brand_name: data.name,
        website: data.website,
        app_link: data.app_link,
        logo_url: data.logo_url
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      if (onSuccess) {
        onSuccess();
      }
      reset();
      handleClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create brand',
      });
      setError(error.response?.data?.message || error.message || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-600 border-white-800">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>
            Create a new brand to start managing its ads and campaigns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              {...register('name')}
              className="bg-gray-600/50 bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 focus:ring-purple-500/20 placeholder:text-zinc-400"
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
              className="bg-gray-600/50 bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 focus:ring-purple-500/20 placeholder:text-zinc-400"
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
              placeholder="https://example.com"
              className="bg-gray-600/50 bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 focus:ring-purple-500/20 placeholder:text-zinc-400"
            />
            {errors.app_link && (
              <p className="text-sm text-red-500">{errors.app_link.message}</p>
            )}
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL (Optional)</Label>
            <Input
              id="logo_url"
              {...register('logo_url')}
              placeholder="https://example.com/logo.png"
              className="bg-gray-900/50"
            />
            {errors.logo_url && (
              <p className="text-sm text-red-500">{errors.logo_url.message}</p>
            )}
          </div> */}

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? 'Creating...' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}