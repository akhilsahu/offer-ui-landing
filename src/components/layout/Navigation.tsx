import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppNavigation } from '@/hooks/use-navigation';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { goToDashboard } = useAppNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for access token
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);

    // Redirect to dashboard if authenticated and on home page
    if (token && location.pathname === '/') {
      goToDashboard();
    }
  }, [location]); // Re-check when location changes

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div /> {/* Empty div for spacing */}
        <div className="flex items-center gap-4">
          {!isAuthenticated && location.pathname === '/' && (
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-white hover:text-white/80"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
