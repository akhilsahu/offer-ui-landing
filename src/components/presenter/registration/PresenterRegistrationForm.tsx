import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import '@/styles/RegistrationForms.css';

const presenterRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  website: z.string().url('Please enter a valid URL'),
  app_link: z.string().url('Please enter a valid URL'),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type PresenterRegistrationFormProps = {
  onSuccess?: () => void;
};

export function PresenterRegistrationForm({ onSuccess }: PresenterRegistrationFormProps) {
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
  } = useForm<z.infer<typeof presenterRegistrationSchema>>({
    resolver: zodResolver(presenterRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      website: '',
      app_link: '',
      terms_accepted: false,
    },
  });

  const termsAccepted = watch('terms_accepted');

  const onSubmit = async (formData: z.infer<typeof presenterRegistrationSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const apiPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        website: formData.website,
        app_link: formData.app_link,
        user_type: 'presenter'
      };

      const response = await api.post(AUTH_ENDPOINTS.register, apiPayload);

      if (response.data && response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_type', 'presenter');
      }
      
      toast({
        title: 'Registration successful!',
        description: 'Your presenter account has been created.',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      navigate('/onboarding/verify', { state: { email: formData.email } });
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      
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
            className="presenter-input"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className="presenter-input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number*</Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            className="presenter-input"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website*</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              {...register('website')}
              className="presenter-input"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_link">App Link*</Label>
            <Input
              id="app_link"
              placeholder="https://play.google.com/store/apps/your-app"
              {...register('app_link')}
              className="presenter-input"
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
              className="presenter-input pr-10"
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
              className="presenter-input pr-10"
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
            <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setValue('terms_accepted', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{' '}
            <Button variant="link" className="h-auto p-0 presenter-gradient-text font-medium">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="h-auto p-0 presenter-gradient-text font-medium">
              Privacy Policy
            </Button>
          </label>
        </div>
        {errors.terms_accepted && (
          <p className="text-red-500 text-sm">{errors.terms_accepted.message}</p>
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
        className="w-full presenter-submit-button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          'Create Presenter Account'
        )}
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{' '}
        <Button
          variant="link"
          className="p-0 presenter-gradient-text"
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>
      </p>
    </form>
  );
}