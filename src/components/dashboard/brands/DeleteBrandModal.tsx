import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/axios';
import { BRAND_ENDPOINTS } from '@/lib/config/endpoints';

interface Brand {
  id: string;
  name: string;
}

interface DeleteBrandModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBrandModal({
  brand,
  isOpen,
  onClose,
}: DeleteBrandModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await api.delete(BRAND_ENDPOINTS.delete(brand.id));

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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {brand.name}? This action cannot be undone.
            All associated ads and campaigns will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? 'Deleting...' : 'Delete Brand'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}