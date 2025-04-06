import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

interface OffersChartsProps {
  selectedBrand: string | 'all';
  dateRange: {
    from: Date;
    to: Date;
  };
}

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];

export function OffersCharts({ selectedBrand, dateRange }: OffersChartsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    clicksOverTime: [],
    conversionRatio: [],
    topOffers: [],
  });

  useEffect(() => {
    fetchChartData();
  }, [selectedBrand, dateRange]);

  async function fetchChartData() {
    try {
      // In a real app, this would fetch from your API
      // For now, using mock data
      setData({
        clicksOverTime: [
          { date: '2025-03-01', clicks: 100 },
          { date: '2025-03-02', clicks: 150 },
          { date: '2025-03-03', clicks: 200 },
          { date: '2025-03-04', clicks: 180 },
          { date: '2025-03-05', clicks: 220 },
        ],
        conversionRatio: [
          { name: 'Converted', value: 60 },
          { name: 'Not Converted', value: 40 },
        ],
        topOffers: [
          { name: 'Summer Sale', clicks: 1200, redemptions: 600 },
          { name: 'Flash Deal', clicks: 800, redemptions: 400 },
          { name: 'Special Offer', clicks: 600, redemptions: 300 },
        ],
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chart data',
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="w-full h-[300px] animate-pulse bg-gray-800/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Clicks Over Time */}
      <Card className="col-span-2 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold mb-4">Clicks Over Time</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.clicksOverTime}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                scale="band"
                stroke="#9CA3AF"
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                padding={{ left: 0, right: 0 }}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                fill="url(#colorClicks)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Conversion Ratio */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold mb-4">Conversion Ratio</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.conversionRatio}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.conversionRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Performing Offers */}
      <Card className="col-span-3 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold mb-4">Top Performing Offers</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topOffers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={12}
                scale="band"
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#8B5CF6" />
              <Bar dataKey="redemptions" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}