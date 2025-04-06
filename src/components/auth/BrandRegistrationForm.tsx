import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Store,
} from 'lucide-react';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import '@/styles/RegistrationForms.css';

const brandRegistrationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    brand_name: z.string().min(2, 'Brand name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    phone: z
      .string()
      .min(10, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    website: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    app_link: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type BrandRegistrationFormProps = {
  onSuccess?: () => void;
};

export function BrandRegistrationForm({
  onSuccess,
}: BrandRegistrationFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof brandRegistrationSchema>>({
    resolver: zodResolver(brandRegistrationSchema),
    defaultValues: {
      name: '',
      brand_name: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      website: 'http://www.',
      app_link: 'http://www.',
      terms_accepted: false,
    },
  });

  const termsAccepted = watch('terms_accepted');

  const onSubmit = async (
    formData: z.infer<typeof brandRegistrationSchema>
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Send only the fields required by the API
      const apiPayload = {
        name: formData.name,
        brand_name: formData.brand_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        user_type: 'brand',
        website: formData.website || undefined,
        app_link: formData.app_link || undefined,
      };

      const response = await api.post(AUTH_ENDPOINTS.register, apiPayload);

      // Save token if available
      if (response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_type', 'brand');
      }

      toast({
        title: 'Registration successful!',
        description: 'Your brand account has been created.',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });

      if (onSuccess) {
        onSuccess();
      }

      // Redirect to onboarding verification page with email in state
      navigate('/onboarding/verify', {
        state: { email: formData.email },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );

      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name*</Label>
          <Input
            id="name"
            placeholder="Your full name"
            {...register('name')}
            className="registration-input"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_name">Brand Name*</Label>
          <Input
            id="brand_name"
            placeholder="Your brand name"
            {...register('brand_name')}
            className="registration-input"
          />
          {errors.brand_name && (
            <p className="text-red-500 text-sm">{errors.brand_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@yourbrand.com"
            {...register('email')}
            className="registration-input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number </Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            className="registration-input"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website </Label>
            <Input
              id="website"
              placeholder="https://yourbrand.com"
              {...register('website')}
              className="registration-input"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_link">App Link </Label>
            <Input
              id="app_link"
              placeholder="https://play.google.com/store/apps/your-app"
              {...register('app_link')}
              className="registration-input"
            />
            {errors.app_link && (
              <p className="text-red-500 text-sm">{errors.app_link.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password*</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              {...register('password')}
              className="registration-input pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm Password*</Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              {...register('confirm_password')}
              className="registration-input pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setValue('terms_accepted', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{' '}
            <Button
              variant="link"
              className="h-auto p-0 registration-gradient-text font-medium"
            >
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button
              variant="link"
              className="h-auto p-0 registration-gradient-text font-medium"
            >
              Privacy Policy
            </Button>
          </label>
        </div>
        {errors.terms_accepted && (
          <p className="text-red-500 text-sm">
            {errors.terms_accepted.message}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !termsAccepted}
        className="w-full brand-submit-button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          <>
            <Store className="mr-2 h-4 w-4" />
            Create Brand Account
          </>
        )}
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{' '}
        <Button
          variant="link"
          className="p-0 registration-gradient-text"
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>
      </p>
    </form>
  );
}
