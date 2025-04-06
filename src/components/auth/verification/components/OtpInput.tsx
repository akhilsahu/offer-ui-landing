import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertMessage } from '@/components/ui/alert-message';
import { ArrowRight, Loader2 } from 'lucide-react';

interface OtpInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  error: string | null;
  loading: boolean;
  onVerify: () => void;
}

export function OtpInput({ otp, setOtp, error, loading, onVerify }: OtpInputProps) {
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

  return (
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
        onClick={onVerify}
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
  );
}