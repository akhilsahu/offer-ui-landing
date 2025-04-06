import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { AUTH_ENDPOINTS } from '@/lib/config/endpoints';
import { VerificationHeader } from './components/VerificationHeader';
import { OtpInput } from './components/OtpInput';
import { VerificationActions } from './components/VerificationActions';

export function VerificationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const statusCheckInterval = useRef<number>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>(
    location.state?.verificationMethod || 'email'
  );

  useEffect(() => {
    const pendingUserId = localStorage.getItem('pending_user_id');
    if (!pendingUserId) {
      navigate('/signup/brand');
      return;
    }

    // Start polling verification status
    statusCheckInterval.current = window.setInterval(checkVerificationStatus, 3000);

    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, [navigate]);

  const checkVerificationStatus = async () => {
    try {
      const userId = localStorage.getItem('pending_user_id');
      const email = localStorage.getItem('user_email')
      const response = await api.post(AUTH_ENDPOINTS.verify.status, {
       email: email  
      });

      if (response.data.is_verified) {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
        }
        toast({
          title: 'Success!',
          description: 'Your account has been verified.',
        });
        localStorage.removeItem('pending_user_id');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_email');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
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
            description: 'Verification code accepted.',
          });
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
        <VerificationHeader method={verificationMethod} />
        
        <div className="space-y-6">
          {verificationMethod === 'phone' ? (
          <OtpInput
            otp={otp}
            setOtp={setOtp}
            error={error}
            loading={loading}
            onVerify={handleVerification}
          />
          ) : (
            <p className="text-center text-muted-foreground">
              Click the verification link in your email to continue
            </p>
          )}
           <VerificationActions
          method={verificationMethod}
          loading={loading}
          onResend={handleResendCode}
        />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
               Use one of the following to verify
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setVerificationMethod(
              verificationMethod === 'email' ? 'phone' : 'email'
            )}
            disabled={loading}
          >
            {verificationMethod === 'email' 
              ? 'Use phone verification instead'
              : 'Use email verification instead'
            }
          </Button>
        </div>

       
      </div>
    </motion.div>
  );
}