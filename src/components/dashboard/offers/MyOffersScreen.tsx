import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BrandSelector } from './components/BrandSelector';
import { OffersCharts } from './components/OffersCharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddOfferModal } from './components/AddOfferModal';
import { AdsList } from './components/AdsList';
import DashboardHeader from '../DashboardHeader';

type FilterType = 'all' | 'active' | 'ended';

export function MyOffersScreen() {
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>('all');
  const [showCharts, setShowCharts] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // Last 7 days
    to: new Date(),
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Always increment refreshTrigger on every brand selection
  const handleBrandSelect = useCallback(
    (brandId: string | 'all') => {
      console.log(
        `Brand selected in MyOffersScreen: ${brandId}, current: ${selectedBrand}`
      );
      setSelectedBrand(brandId);
      // Force a refresh of the offers list by incrementing the trigger
      setRefreshTrigger((prev) => prev + 1);
    },
    [selectedBrand]
  );

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    // Also refresh the ads list when filter changes
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    // Refresh when date range changes
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreateSuccess = useCallback(() => {
    // Trigger a refresh of the offers list
    console.log('Offer created successfully, triggering refresh');
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <DashboardHeader
        title="My  Brand Offer Ads"
        tagline="Track & manage your brand offers,  all in one place! "
        showButton={true}
        buttonText="Add a New Offer"
        onButtonClick={() => setIsAddModalOpen(true)}
      ></DashboardHeader>
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
            My Brand Offer Ads
          </h1>
          <p className="text-gray-400">
            Track & manage your brand offers, all in one place!
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add a New Offer
          </Button>
        </div>
      </div> */}
      {/* <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-16 lg:pt-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
            My Brand Offer Ads
          </h1>
          <p className="text-gray-400">
            Track & manage your brand offers, all in one place!
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowCharts(prev => !prev)}
            className="bg-gray-900/50"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add a New Offer
          </Button>
        </div>
      </div> */}

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={showCharts ? 'block' : 'hidden'}
      >
        <OffersCharts selectedBrand={selectedBrand} dateRange={dateRange} />
      </motion.div>

      {/* Brand Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BrandSelector
          selectedBrand={selectedBrand}
          onBrandSelect={handleBrandSelect}
          refreshTrigger={refreshTrigger}
        />
      </motion.div>

      {/* Ads List with Integrated Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AdsList
          selectedBrand={selectedBrand}
          refreshTrigger={refreshTrigger}
          filter={filter}
          onFilterChange={handleFilterChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </motion.div>

      {/* Add Offer Modal */}
      <AddOfferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedBrand={selectedBrand}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
