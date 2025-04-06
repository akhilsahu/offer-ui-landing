import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  X,
  PresentationIcon,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
        isActive &&
          'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white',
        !isActive &&
          'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10'
      )}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
    </Button>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSectionChange: (section: string) => void;
}

export function DashboardLayout({
  children,
  onSectionChange,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [activeRole, setActiveRole] = useState<'brand' | 'presenter'>('brand');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    onSectionChange(section);
    // Immediately close the mobile menu when a section is selected
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    { id: 'brands', label: 'My Brands', icon: <Store className="w-5 h-5" /> },
    {
      id: 'ads',
      label: 'My Offers',
      icon: <PresentationIcon className="w-5 h-5" />,
    },
    // { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    // { id: 'payouts', label: 'Payouts', icon: <Wallet className="w-5 h-5" /> },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm fixed top-0 left-0 right-0 z-[60]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <span className="font-bold">Dashboard</span>
        </div>
      </div>
              
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col gap-6 p-6 bg-black/20 backdrop-blur-sm h-screen lg:sticky lg:top-0 pt-20 lg:pt-6',
            'transform transition-transform duration-300',
            isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0',
            isCollapsed ? 'w-20' : 'w-64'
          )}
          animate={{ width: isCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="font-bold text-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Role Switcher */}
          <div
            className={cn(
              'grid gap-1 p-1 rounded-lg bg-black/20',
              isCollapsed ? 'grid-cols-1' : 'grid-cols-2'
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                'relative',
                activeRole === 'brand' && 'text-white',
                !isCollapsed && 'px-4 py-2'
              )}
              onClick={() => setActiveRole('brand')}
            >
              {activeRole === 'brand' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-md"
                  layoutId="activeRole"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Store className="w-5 h-5" />
              {!isCollapsed && <span className="ml-2">Brand</span>}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'relative',
                activeRole === 'presenter' && 'text-white',
                !isCollapsed && 'px-4 py-2'
              )}
              onClick={() => setActiveRole('presenter')}
            >
              {activeRole === 'presenter' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-md"
                  layoutId="activeRole"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <PresentationIcon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-2">Presenter</span>}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeSection === item.id}
                onClick={() => handleSectionChange(item.id)}
              />
            ))}
          </nav>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            className="self-end"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 w-full mt-16 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
