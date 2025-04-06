import { Mail, Phone } from 'lucide-react';

interface VerificationHeaderProps {
  method: 'email' | 'phone';
}

export function VerificationHeader({ method }: VerificationHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      {method === 'email' ? (
        <Mail className="mx-auto h-12 w-12 text-primary opacity-50" />
      ) : (
        <Phone className="mx-auto h-12 w-12 text-primary opacity-50" />
      )}
      <h1 className="text-2xl font-bold tracking-tight">
        {method === 'email' ? 'Check your email' : 'Enter verification code'}
      </h1>
      <p className="text-muted-foreground">
        {method === 'email'
          ? 'We sent you a verification link. Please check your email.'
          : 'Enter the 6-digit code we sent to your phone.'}
      </p>
    </div>
  );
}