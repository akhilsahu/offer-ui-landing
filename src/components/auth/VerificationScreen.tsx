import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import { AlertMessage } from '@/components/ui/alert-message';

export function VerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationMethod] = useState<'email' | 'phone'>(
    location.state?.verificationMethod || 'email'
  );

  useEffect(() => {
    // Check if we have a pending user ID
    const pendingUserId = localStorage.getItem('pending_user_id');
    if (!pendingUserId) {
      navigate('/signup/brand');
    }
  }, [navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem('pending_user_id');

    try {
      if (verificationMethod === 'phone') {
        const response = await api.post(AUTH_ENDPOINTS.verify.phone.verify, {
          phone: localStorage.getItem('user_phone'),
          otp: otp.join('')
        });

        if (response.data.is_verified) {
          toast({
            title: 'Success!',
            description: 'Your phone number has been verified.',
          });
          localStorage.removeItem('pending_user_id');
          localStorage.removeItem('user_phone');
          navigate('/login');
        }
      }

    } catch (error: any) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const userId = localStorage.getItem('pending_user_id');
      
      if (verificationMethod === 'phone') {
        await api.post(AUTH_ENDPOINTS.verify.phone.send, {
          phone: localStorage.getItem('user_phone')
        });
      } else {
        await api.post(AUTH_ENDPOINTS.verify.email.send, {
          email: localStorage.getItem('user_email')
        });
      }

      toast({
        title: 'Code Resent',
        description: `A new verification code has been sent to your ${verificationMethod}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to resend code',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-md mx-auto p-6"
    >
      <div className="space-y-6 bg-card rounded-lg shadow-lg p-8 backdrop-blur-sm">
        <div className="space-y-2 text-center">
          {verificationMethod === 'email' ? (
            <Mail className="mx-auto h-12 w-12 text-primary opacity-50" />
          ) : (
            <Phone className="mx-auto h-12 w-12 text-primary opacity-50" />
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            {verificationMethod === 'email'
              ? 'Check your email'
              : 'Enter verification code'}
          </h1>
          <p className="text-muted-foreground">
            {verificationMethod === 'email'
              ? 'We sent you a verification link. Please check your email.'
              : 'Enter the 6-digit code we sent to your phone.'}
          </p>
        </div>

        {verificationMethod === 'phone' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg"
                  autoComplete="off"
                />
              ))}
            </div>
            {error && <AlertMessage message={error} />}
            <Button
              className="w-full"
              onClick={handleVerification}
              disabled={loading || otp.some((digit) => !digit)}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Verify Account
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full"
          onClick={handleResendCode}
          disabled={loading}
        >
          Resend {verificationMethod === 'email' ? 'email' : 'code'}
        </Button>
      </div>
    </motion.div>
  );
}