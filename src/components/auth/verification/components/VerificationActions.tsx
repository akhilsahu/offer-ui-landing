import { Button } from '@/components/ui/button';

interface VerificationActionsProps {
  method: 'email' | 'phone';
  loading: boolean;
  onResend: () => void;
}

export function VerificationActions({ method, loading, onResend }: VerificationActionsProps) {
  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={onResend}
      disabled={loading}
    >
      Resend {method === 'email' ? 'email' : 'code'}
    </Button>
  );
}