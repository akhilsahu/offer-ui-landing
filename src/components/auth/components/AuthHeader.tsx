import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAppNavigation } from '@/hooks/use-navigation';

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  const { goToHome } = useAppNavigation();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-6 hover:bg-white/10"
        onClick={goToHome}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </>
  );
}