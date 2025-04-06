import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrandList } from './BrandList';
import { AddBrandModal } from './AddBrandModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import DashboardHeader from '../DashboardHeader';

export function MyBrandsScreen() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBrandChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="My Brands"
        tagline="Manage your brands and their advertising campaigns"
        showButton={true}
        buttonText="Add New Brand"
        onButtonClick={() => setIsAddModalOpen(true)}
      ></DashboardHeader>
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Brands</h1>
          <p className="text-gray-400">
            Manage your brands and their advertising campaigns
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Brand
        </Button>
      </div> */}
      {/* <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-16 lg:pt-0">
        <div>
          <h1 className="text-2xl font-bold">My Brands</h1>
          <p className="text-gray-400">Manage your brands and their advertising campaigns</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Brand
        </Button>
      </div> */}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900/50"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BrandList searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
      </motion.div>

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleBrandChange}
      />
    </div>
  );
}
