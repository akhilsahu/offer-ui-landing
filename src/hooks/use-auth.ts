import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role?: string;
  user_type?: string;
  is_verified: boolean;
  is_active: boolean;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'brand' | 'presenter' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        setIsAuthenticated(true);
        
        // Try to get user data from localStorage
        const userDataString = localStorage.getItem('user_data');
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            setUser(userData);
            
            // Set user type based on user data or separate storage
            const userTypeValue = userData.role || userData.user_type || localStorage.getItem('user_type');
            if (userTypeValue === 'presenter') {
              setUserType('presenter');
            } else {
              setUserType('brand');
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        } else {
          // Fallback to checking just the user type
          const storedUserType = localStorage.getItem('user_type');
          if (storedUserType === 'presenter') {
            setUserType('presenter');
          } else {
            setUserType('brand');
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    navigate('/');
  };

  return { isAuthenticated, user, userType, loading, logout };
}