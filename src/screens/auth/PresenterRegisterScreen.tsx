import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PresenterRegistrationForm } from '@/components/presenter/registration/PresenterRegistrationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PresentationIcon, Store } from 'lucide-react';
import '@/styles/RegistrationForms.css';

export function PresenterRegisterScreen() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Back button - Now absolutely positioned */}
      <Button 
        variant="outline" 
        className="back-button presenter-back-button"
        onClick={goToHome}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back Home</span>
      </Button>
      
      {/* Left side - illustration */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-cyan-900 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center p-8"
          >
            <PresentationIcon className="w-16 h-16 mb-6 text-cyan-400 mx-auto" />
            <h2 className="text-3xl font-bold presenter-gradient-text mb-4">
              Monetize Your Content
            </h2>
            <div className="space-y-6 max-w-lg mx-auto">
              <p className="text-gray-300">
                Join our network of content creators and earn money by promoting relevant products and services to your audience.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-8">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="font-medium text-white mb-2">Flexible Earnings</h3>
                  <p className="text-sm text-gray-400">Get paid per click or conversion - you choose what works best</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="font-medium text-white mb-2">Curated Offers</h3>
                  <p className="text-sm text-gray-400">Access offers that match your audience's interests and needs</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="font-medium text-white mb-2">Powerful Analytics</h3>
                  <p className="text-sm text-gray-400">Track your performance and optimize your content strategy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 2xl:w-2/5 flex flex-col bg-gray-900 pt-16 lg:pt-0">
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold mb-2 presenter-gradient-text">Create Your Presenter Account</h1>
                <p className="text-gray-400">
                  Join our creator network and start monetizing your content today
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700"
            >
              <PresenterRegistrationForm />
            </motion.div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                Do you represent a brand?
              </p>
              <Button 
                variant="outline" 
                className="border-gray-700 hover:border-cyan-500/50 transition-all hover:bg-gray-800/50"
                onClick={() => navigate('/signup/brand')}
              >
                <Store className="mr-2 h-4 w-4" />
                Register as a Brand
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}