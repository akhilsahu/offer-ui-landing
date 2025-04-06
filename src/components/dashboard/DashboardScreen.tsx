import { DashboardLayout } from './DashboardLayout';
import { Overview } from './Overview';
import { MyBrandsScreen } from './brands/MyBrandsScreen';
import { MyOffersScreen } from './offers/MyOffersScreen';
import { SettingsScreen } from './settings/SettingsScreen';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function DashboardScreen() {
  const [activeSection, setActiveSection] = useState('overview');
  const [userType, setUserType] = useState<'brand' | 'presenter'>('brand');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('user_type');
    console.log('userTpe', storedUserType);
    if (storedUserType === 'presenter') {
      setUserType('presenter');
    } else if (storedUserType === 'brand') {
      setUserType('brand');
    }
  }, []);

  // If user is a presenter, show the presenter dashboard

  // Brand user gets the standard dashboard
  const renderContent = () => {
    switch (activeSection) {
      case 'brands':
        return <MyBrandsScreen />;
      case 'ads':
        return <MyOffersScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
}
