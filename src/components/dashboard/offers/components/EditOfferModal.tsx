import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ADS_ENDPOINTS, BRAND_ENDPOINTS } from '@/lib/config/endpoints';
import { useToast } from '@/hooks/use-toast';
import { X, Loader2, Save, ArrowLeft, Upload, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import '@/styles/EditOfferModal.css';

const offerSchema = z.object({
  brand_id: z.string().min(1, 'Please select a brand'),
  ad_name: z.string().min(2, 'Ad name must be at least 2 characters').transform(val => val.trim()),
  product_name: z.string().min(2, 'Product name must be at least 2 characters').transform(val => val.trim()),
  tagline: z.string().max(200, 'Tagline must be less than 200 words').transform(val => val.trim()),
  details: z.string().min(10, 'Details must be at least 10 characters').transform(val => val.trim()),
  redemption_steps: z.string().min(10, 'Redemption steps must be at least 10 characters').transform(val => val.trim()),
  tnc: z.string().min(10, 'Terms and conditions must be at least 10 characters').transform(val => val.trim()),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  landing_url: z.string().url('Must be a valid URL').transform(val => val.trim()),
  is_active: z.boolean(),
});

interface Brand {
  id: string;
  brand_name: string;
}

interface OfferData {
  id: string;
  ad_name: string;
  brand_id: string;
  brand_name: string;
  category: string | null;
  coupon_code: string | null;
  created_at: string;
  created_by: string;
  details: string;
  image_url: string | null;
  is_active: boolean;
  landing_url: string;
  product_name: string;
  redemption_steps: string;
  tagline: string;
  tags: string[];
  tnc: string;
}

interface EditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerData: OfferData | null;
  onSuccess?: () => void;
}

export function EditOfferModal({ isOpen, onClose, offerData, onSuccess }: EditOfferModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Saving changes...');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Store the selected image file to send in the request
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

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
      brand_id: '',
      ad_name: '',
      product_name: '',
      tagline: '',
      details: '',
      redemption_steps: '',
      tnc: '',
      image_url: '',
      landing_url: '',
      is_active: true,
    }
  });

  const watchedImageUrl = watch('image_url');
  const watchedBrandId = watch('brand_id');

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // Cap progress at 95% until actually complete
          const newProgress = prev + (95 - prev) * 0.1;
          if (newProgress >= 95) {
            clearInterval(interval);
            return 95;
          }
          return newProgress;
        });
        
        // Update loading message during different stages
        if (loadingProgress < 30) {
          setLoadingStatus('Preparing data...');
        } else if (loadingProgress < 60) {
          setLoadingStatus('Uploading changes...');
        } else if (loadingProgress < 90) {
          setLoadingStatus('Finalizing updates...');
        }
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [loading, loadingProgress]);

  // Load brands when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  // Update image preview when image URL changes
  useEffect(() => {
    if (watchedImageUrl) {
      setImagePreviewUrl(watchedImageUrl);
      setImageError(false);
    }
  }, [watchedImageUrl]);

  // Populate form when offerData changes
  useEffect(() => {
    if (offerData && isOpen) {
      console.log("Setting form data from offerData:", offerData);
      reset({
        brand_id: offerData.brand_id,
        ad_name: offerData.ad_name,
        product_name: offerData.product_name,
        tagline: offerData.tagline,
        details: offerData.details,
        redemption_steps: offerData.redemption_steps,
        tnc: offerData.tnc,
        image_url: offerData.image_url || '',
        landing_url: offerData.landing_url,
        is_active: offerData.is_active,
      });
      
      // Parse and set tags
      if (Array.isArray(offerData.tags)) {
        setTags(offerData.tags);
      } else if (typeof offerData.tags === 'string') {
        setTags(offerData.tags.split(',').map(tag => tag.trim()).filter(Boolean));
      } else {
        setTags([]);
      }
      
      // Set the image preview URL
      if (offerData.image_url) {
        setImagePreviewUrl(offerData.image_url);
      }
    }
  }, [offerData, isOpen, reset]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setTags([]);
      setCurrentTag('');
      setImagePreviewUrl('');
      setImageError(false);
      setBrandsLoaded(false);
      setSelectedImageFile(null); // Clear selected image file
      setErrorMessage(null); // Clear any error messages
    }
  }, [isOpen, reset]);

  // Ensure brand_id is correctly set after brands are loaded
  useEffect(() => {
    if (brandsLoaded && offerData && isOpen) {
      console.log("Brands loaded, setting brand_id to:", offerData.brand_id);
      // Make sure the brand_id is set even after brands are loaded
      setValue('brand_id', offerData.brand_id);
    }
  }, [brandsLoaded, offerData, isOpen, setValue]);

  // Fetch brands list from API
  const fetchBrands = async () => {
    try {
      setBrandsLoading(true);
      const response = await api.get(BRAND_ENDPOINTS.list);
      const brandsData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      setBrands(brandsData);
      
      console.log("Brands loaded:", brandsData);
      
      // If we have offerData, find the matching brand to ensure it's selected
      if (offerData) {
        const matchingBrand = brandsData.find(brand => brand.id === offerData.brand_id);
        if (matchingBrand) {
          console.log("Found matching brand:", matchingBrand.brand_name);
        } else {
          console.log("No matching brand found for ID:", offerData.brand_id);
        }
      }
      
      setBrandsLoaded(true);
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load brands list',
      });
      setErrorMessage('Failed to load brands list. Please try again.');
    } finally {
      setBrandsLoading(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      // Check if this is a comma-separated list
      if (currentTag.includes(',')) {
        // Split into multiple tags
        const newTags = currentTag.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag && !tags.includes(tag));
        
        if (newTags.length > 0) {
          setTags(prevTags => [...prevTags, ...newTags]);
        }
      } else {
        // Add as a single tag if not already present
        if (!tags.includes(currentTag.trim())) {
          setTags(prevTags => [...prevTags, currentTag.trim()]);
        }
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for submission
      setSelectedImageFile(file);
      
      // Create a local preview URL
      const objectUrl = URL.createObjectURL(file);
      setValue('image_url', objectUrl);
      setImagePreviewUrl(objectUrl);
      setImageError(false);
      
      // Show success toast
      toast({
        title: "Image Selected",
        description: "New image has been selected for the offer",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: z.infer<typeof offerSchema>) => {
    if (!offerData) return;
    
    setLoading(true);
    setErrorMessage(null);
    setLoadingProgress(0);
    setLoadingStatus('Preparing data...');
    
    try {
      // Prepare the data for submission
      let response;
      
      // Simulate a minimum loading time of 1 second for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If we have a selected image file, use FormData approach
      if (selectedImageFile) {
        setLoadingStatus('Uploading image...');
        const formData = new FormData();
        
        // Add all form fields to FormData
        formData.append('brand_id', data.brand_id);
        formData.append('ad_name', data.ad_name);
        formData.append('product_name', data.product_name);
        formData.append('tagline', data.tagline);
        formData.append('details', data.details);
        formData.append('redemption_steps', data.redemption_steps);
        formData.append('tnc', data.tnc);
        formData.append('landing_url', data.landing_url);
        formData.append('is_active', data.is_active.toString());
        
        // Add the image file
        formData.append('image', selectedImageFile);
        
        // Add tags as a comma-separated string
        formData.append('tags', tags.join(','));
        
        // Send the request with FormData
        response = await api.put(ADS_ENDPOINTS.get(offerData.id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        setLoadingStatus('Updating offer...');
        // If no new image selected, use regular JSON request
        response = await api.put(ADS_ENDPOINTS.get(offerData.id), {
          brand_id: data.brand_id,
          ad_name: data.ad_name,
          product_name: data.product_name,
          tagline: data.tagline,
          details: data.details,
          redemption_steps: data.redemption_steps,
          tnc: data.tnc,
          image_url: data.image_url,
          landing_url: data.landing_url,
          is_active: data.is_active,
          tags: tags // Send tags as array
        });
      }

      // Set loading progress to 100% for completion
      setLoadingProgress(100);
      setLoadingStatus('Changes saved successfully!');
      
      // Small delay to show the completion state before closing
      await new Promise(resolve => setTimeout(resolve, 600));

      toast({
        title: 'Success',
        description: 'Offer updated successfully',
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });

      // Call onSuccess callback to refresh the offers list
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error updating offer:', error);
      setLoadingProgress(0);
      
      // Extract error message
      const errorMsg = error.response?.data?.message || 'Failed to update offer. Please try again.';
      setErrorMessage(errorMsg);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  // Find the brand name for display purposes
  const getSelectedBrandName = () => {
    if (!watchedBrandId) return null;
    const selectedBrand = brands.find(brand => brand.id === watchedBrandId);
    return selectedBrand ? selectedBrand.brand_name : null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="edit-offer-modal-overlay"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="edit-offer-modal"
          >
            {/* Loading Overlay */}
            {loading && (
              <div className="edit-offer-loading-overlay">
                <div className="edit-offer-loading-content">
                  <div className="edit-offer-loader"></div>
                  <div>
                    <p className="edit-offer-loading-text">{loadingStatus}</p>
                    <p className="edit-offer-loading-subtext">Please don't close this window while we're saving your changes.</p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${loadingProgress}%`, transition: 'width 0.3s ease' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header with improved mobile layout */}
            <div className="edit-offer-modal-header">
              <div className="flex items-center gap-2 flex-shrink-0">
                <ArrowLeft 
                  className="h-5 w-5 cursor-pointer hover:text-purple-400 transition-colors" 
                  onClick={onClose}
                />
                <h2 className="text-xl font-bold sm:block hidden">Edit Offer</h2>
              </div>
              
              {/* Center the title on mobile */}
              <h2 className="text-xl font-bold sm:hidden block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Edit Offer
              </h2>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="edit-offer-button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="sm:inline hidden">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      <span className="sm:inline hidden">Save Changes</span>
                    </>
                  )}
                </Button>
                <button
                  onClick={onClose}
                  className="edit-offer-close-button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="edit-offer-modal-content">
              {/* Error Message */}
              {errorMessage && (
                <div className="edit-offer-error-box mb-6">
                  <AlertCircle className="edit-offer-error-icon h-5 w-5" />
                  <div className="edit-offer-error-content">
                    <h4 className="edit-offer-error-title">Error</h4>
                    <p className="edit-offer-error-message">{errorMessage}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ROW 1: Brand Dropdown and What's the offer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="brand_id" className="edit-offer-label">Brand</Label>
                    <div className="edit-offer-brand-select">
                      <Select
                        value={watchedBrandId}
                        onValueChange={(value) => setValue('brand_id', value)}
                        disabled={brandsLoading}
                      >
                        <SelectTrigger className="edit-offer-select-trigger">
                          <SelectValue placeholder={brandsLoading ? "Loading brands..." : "Select brand"}>
                            {getSelectedBrandName() || "Select brand"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {brands.length === 0 ? (
                            <SelectItem value="loading" disabled>No brands available</SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.brand_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.brand_id && (
                      <p className="text-sm text-red-500">{errors.brand_id.message}</p>
                    )}
                  </div>
                  
                  {/* Ad Name */}
                  <div className="space-y-2">
                    <Label htmlFor="ad_name" className="edit-offer-label">What's the offer?</Label>
                    <Input
                      id="ad_name"
                      {...register('ad_name')}
                      placeholder="40% off 300 cashback Sale"
                      className="edit-offer-input"
                    />
                    {errors.ad_name && (
                      <p className="text-sm text-red-500">{errors.ad_name.message}</p>
                    )}
                  </div>
                </div>
                
                {/* ROW 2: Tagline and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tagline */}
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="edit-offer-label">Tagline</Label>
                    <Input
                      id="tagline"
                      {...register('tagline')}
                      placeholder="Anything short but catchy: An offer you cant refuse"
                      className="edit-offer-input"
                    />
                    {errors.tagline && (
                      <p className="text-sm text-red-500">{errors.tagline.message}</p>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="edit-offer-label">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="edit-offer-tag"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={addTag}
                        className="edit-offer-input"
                        placeholder="Type tags separated by commas or press Enter"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addTag}
                        className="edit-offer-tag-button"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* ROW 3: Image (30% size) and Landing URL & Terms stacked */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image Upload - Now smaller (30% of original size) */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="edit-offer-label">Image</Label>
                    <div className="relative">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      
                      {/* Completely hidden URL Field - Only for programmatic setting */}
                      <input
                        type="hidden"
                        {...register('image_url')}
                      />
                      
                      {/* Image Preview with Upload Overlay - Smaller size */}
                      <div 
                        ref={imageContainerRef}
                        className="edit-offer-image-container-small" 
                        onClick={triggerFileInput}
                      >
                        {imagePreviewUrl && !imageError ? (
                          <>
                            <img 
                              src={imagePreviewUrl} 
                              alt="Offer Preview" 
                              className="edit-offer-image"
                              onError={handleImageError}
                            />
                            <div className="edit-offer-image-overlay">
                              <Camera className="h-4 w-4" />
                              <span className="text-xs">Change</span>
                            </div>
                          </>
                        ) : (
                          <div className="edit-offer-image-upload">
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-xs">Upload</span>
                          </div>
                        )}
                      </div>
                      
                      {errors.image_url && (
                        <p className="text-sm text-red-500 mt-1">{errors.image_url.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Landing URL and Terms & Conditions stacked */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Landing URL */}
                    <div className="space-y-2">
                      <Label htmlFor="landing_url" className="edit-offer-label">Landing URL</Label>
                      <Input
                        id="landing_url"
                        {...register('landing_url')}
                        placeholder="https://example.com/offer"
                        className="edit-offer-input"
                      />
                      {errors.landing_url && (
                        <p className="text-sm text-red-500">{errors.landing_url.message}</p>
                      )}
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="space-y-2">
                      <Label htmlFor="tnc" className="edit-offer-label">Terms & Conditions</Label>
                      <Textarea
                        id="tnc"
                        {...register('tnc')}
                        placeholder="Terms and conditions for the offer"
                        className="edit-offer-textarea h-20"
                      />
                      {errors.tnc && (
                        <p className="text-sm text-red-500">{errors.tnc.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* ROW 4: Toggle and Product Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Toggle */}
                  <div className="space-y-2">
                    <Label className="edit-offer-label">Offer Status</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        {...register('is_active')}
                        className="edit-offer-checkbox"
                      />
                      <Label htmlFor="is_active" className="text-zinc-200 cursor-pointer">
                        Active (uncheck to pause offer)
                      </Label>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="product_name" className="edit-offer-label">Product Name</Label>
                    <Input
                      id="product_name"
                      {...register('product_name')}
                      placeholder="Store Wide or Premium Headphones"
                      className="edit-offer-input"
                    />
                    {errors.product_name && (
                      <p className="text-sm text-red-500">{errors.product_name.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Details and Redemption Steps section - hidden in tabs or accordion for cleaner UI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Details */}
                  <div className="space-y-2">
                    <Label htmlFor="details" className="edit-offer-label">Details</Label>
                    <Textarea
                      id="details"
                      {...register('details')}
                      placeholder="Exciting details about the offer"
                      className="edit-offer-textarea h-24"
                    />
                    {errors.details && (
                      <p className="text-sm text-red-500">{errors.details.message}</p>
                    )}
                  </div>
                  
                  {/* Redemption Steps */}
                  <div className="space-y-2">
                    <Label htmlFor="redemption_steps" className="edit-offer-label">Redemption Steps</Label>
                    <Textarea
                      id="redemption_steps"
                      {...register('redemption_steps')}
                      placeholder="How to grab the offer"
                      className="edit-offer-textarea h-24"
                    />
                    {errors.redemption_steps && (
                      <p className="text-sm text-red-500">{errors.redemption_steps.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}