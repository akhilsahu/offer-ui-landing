import { useNavigate } from 'react-router-dom';

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate('/'),
    goToSignup: (type: 'brand' | 'presenter') => navigate(`/signup/${type}`),
    goToLogin: () => navigate('/login'),
    goToDashboard: () => navigate('/dashboard'),
  };
}