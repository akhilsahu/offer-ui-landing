import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/axios';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthHeader } from './components/AuthHeader';
import { FormField } from './components/FormField';
import { UserTypeSelector } from './components/UserTypeSelector';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertMessage } from '@/components/ui/alert-message';


const brandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  website: z.string().url('Must be a valid URL'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'), 
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const presenterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  platformTypes: z.array(z.enum(['website', 'app'])).min(1, 'Select at least one platform'),
  websiteUrl: z.string().url().optional(),
  appName: z.string().min(2).optional(),
  appLink: z.string().url().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type UserType = 'brand' | 'presenter';

export function AuthForm() {
  const { type } = useParams<{ type: UserType }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType>(type as UserType || 'brand');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type) {
      setUserType(type as UserType);
    }
  }, [type]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, setValue,
  } = useForm({
    resolver: zodResolver(userType === 'brand' ? brandSchema : presenterSchema),
    defaultValues: {
      platformTypes: ['website'],
    },
  });

  const platformTypes = watch('platformTypes') || [];

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
       
      const response = await api.post(AUTH_ENDPOINTS.register, {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        website: userType === 'brand' ? data.website : data.websiteUrl,
        app_link: userType === 'presenter' && platformTypes.includes('app') ? data.appLink : undefined,
        user_type: userType,
      });

      toast({
        title: 'Success!',
        description: response.data.instructions,
      });

      // Optional: Store the user ID for future use
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_phone', data.phone);
      localStorage.setItem('pending_user_id', response.data.user_id);
      
      // Navigate to verification screen
      navigate('/verify', {
        state: {
          verificationMethod: response.data.verification_method || 'email'
        }
      });

    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-md mx-auto p-6 relative"
    >
   
      
      <div className="space-y-6 bg-card rounded-lg shadow-lg p-8 backdrop-blur-sm">
        <AuthHeader
          title={userType === 'brand' ? 'Brand Registration' : 'Presenter Registration'}
          description={
            userType === 'brand'
              ? 'Create your brand account to start advertising'
              : 'Provide offers to your customer from various brands across categories'
          }
        />

        <UserTypeSelector
          value={userType}
          onChange={(value) => setUserType(value as UserType)}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            id="name"
            label="Name"
            placeholder={userType === 'brand' ? 'Your Brand Name' : "Your Full Name"}
            register={register}
            error={errors.name?.message}
          />
          <FormField
            id="phone"
            label="Phone Number"
            placeholder="+1234567890"
            register={register}
            error={errors.phone?.message}
          />
          {userType === 'brand' && (
            <FormField
              id="website"
              label="Website"
              placeholder="https://yourbrand.com"
              register={register}
              error={errors.website?.message}
            />
          )}

          {userType === 'presenter' && (
            <>
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-zinc-200">Platform Type</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="website"
                        value="website"
                        className="text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                        checked={platformTypes.includes('website')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...platformTypes, 'website']
                            : platformTypes.filter(t => t !== 'website');
                          setValue('platformTypes', newTypes);
                        }}
                      />
                      <Label htmlFor="website" className="text-zinc-200">Website</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="app"
                        value="app"
                        className="text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                        checked={platformTypes.includes('app')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...platformTypes, 'app']
                            : platformTypes.filter(t => t !== 'app');
                          setValue('platformTypes', newTypes);
                        }}
                      />
                      <Label htmlFor="app" className="text-zinc-200">App</Label>
                    </div>
                  </div>
                  {errors.platformTypes && (
                    <p className="text-sm text-destructive">
                      {errors.platformTypes.message as string}
                    </p>
                  )}
                </div>
              </div>

              {platformTypes.includes('website') && (
                <FormField
                  id="websiteUrl"
                  label="Website URL"
                  placeholder="https://yoursite.com"
                  register={register}
                  error={errors.websiteUrl?.message}
                />
              )}

              {platformTypes.includes('app') && (
                <>
                  <FormField
                    id="appName"
                    label="App Name"
                    placeholder="Your App Name"
                    register={register}
                    error={errors.appName?.message}
                  />
                  <FormField
                    id="appLink"
                    label="App Link"
                    placeholder="https://play.google.com/store/apps/your-app"
                    register={register}
                    error={errors.appLink?.message}
                  />
                </>
              )}
            </>
          )}

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            register={register}
            error={errors.email?.message}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
          {error && (
            <AlertMessage message={error} />
          )}
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}