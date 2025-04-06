import { ThemeProvider } from '@/components/theme-provider';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { HeroSection } from '@/components/landing/HeroSection';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { VerificationScreen } from '@/screens/auth/VerificationScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { DashboardScreen } from '@/components/dashboard/DashboardScreen';
import { Navigation } from '@/components/layout/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { BrandRegisterScreen } from '@/screens/auth/BrandRegisterScreen';
import { PresenterRegisterScreen } from '@/screens/auth/PresenterRegisterScreen';
import { OnboardingVerificationScreen } from '@/screens/onboarding/OnboardingVerificationScreen';
import { OnboardingIncompleteScreen } from '@/screens/onboarding/OnboardingIncompleteScreen';
import { AboutScreen } from '@/screens/info/AboutScreen';
import { ContactScreen } from '@/screens/info/ContactScreen';
import { PrivacyPolicyScreen } from '@/screens/info/PrivacyPolicyScreen';
import { TermsScreen } from '@/screens/info/TermsScreen';

import './App.css';

// Protected route component to handle authentication
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <Router>
          <main className="min-h-screen w-full bg-background font-sans antialiased overflow-x-hidden">
            <Navigation />
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/signup/:type" element={<RegisterScreen />} />
              <Route path="/signup/brand" element={<BrandRegisterScreen />} />
              <Route
                path="/signup/presenter"
                element={<PresenterRegisterScreen />}
              />
              <Route path="/verify" element={<VerificationScreen />} />
              <Route
                path="/onboarding/verify"
                element={<OnboardingVerificationScreen />}
              />
              <Route
                path="/onboarding/incomplete"
                element={<OnboardingIncompleteScreen />}
              />
              <Route path="/about-us" element={<AboutScreen />} />
              <Route path="/contact-us" element={<ContactScreen />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
              <Route path="/terms-and-conditions" element={<TermsScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </Router>
        <Toaster />
      </>
    </ThemeProvider>
  );
}

export default App;
