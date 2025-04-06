import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(AUTH_ENDPOINTS.login, {
        email: data.email,
        password: data.password,
      });
      console.log(response.data);
      var res_data = response.data;
      if (res_data && res_data.access_token) {
        localStorage.setItem('access_token', res_data.access_token);
        localStorage.setItem('user_email', res_data.user.email);

        if (res_data.user.user_type) {
          localStorage.setItem('user_type', res_data.user.user_type);
        }

        // Check if onboarding is complete
        if (response.data.onboarding_complete === false) {
          navigate('/onboarding/incomplete');
          return;
        }

        toast({
          title: 'Login successful!',
          description: 'Welcome back to the platform.',
        });

        if (onSuccess) {
          onSuccess();
        }

        navigate('/dashboard');
      } else {
        setError('Invalid response received. Please try again.');
      }
    } catch (error: any) {
      console.error('Login  error:', error);

      // if (error?.response?.data.onboarding_complete === false) {
      if ([false, null].includes(error?.response?.data.onboarding_complete)) {
        navigate('/onboarding/incomplete');
        return;
      }
      setError(
        error.response?.data?.message ||
          'Failed to login. Please check your credentials.'
      );

      toast({
        variant: 'destructive',
        title: 'Login failed',
        description:
          error.response?.data?.message ||
          'Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="registration-input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Enter your password"
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
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="link"
          className="px-0 text-sm text-gray-400 hover:text-white"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </Button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full brand-submit-button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Don't have an account?{' '}
        <Button
          variant="link"
          className="p-0 registration-gradient-text"
          onClick={() => navigate('/signup/brand')}
        >
          Create account
        </Button>
      </p>
    </form>
  );
}
