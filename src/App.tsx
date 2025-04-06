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
import { Navigation } from '@/components/layout/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { BrandRegisterScreen } from '@/screens/auth/BrandRegisterScreen';
import { PresenterRegisterScreen } from '@/screens/auth/PresenterRegisterScreen';
import { OnboardingVerificationScreen } from '@/screens/onboarding/OnboardingVerificationScreen';
import { OnboardingIncompleteScreen } from '@/screens/onboarding/OnboardingIncompleteScreen';
import { AboutScreen } from '@/screens/info/AboutScreen';
import { ContactScreen } from '@/screens/info/ContactScreen';
import { PrivacyPolicyScreen } from '@/screens/info/PrivacyPolicyScreen';
import { TermsScreen } from '@/screens/info/TermsScreen';

import './App.css';



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
              
            </Routes>
          </main>
        </Router>
        <Toaster />
      </>
    </ThemeProvider>
  );
}

export default App;
