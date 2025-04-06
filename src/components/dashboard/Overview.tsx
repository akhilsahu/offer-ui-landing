import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { ArrowUpRight, Users, Coins, Ticket, MousePointer } from 'lucide-react';
import DashboardHeader from './DashboardHeader';

const mockData = {
  earnings: [
    { date: '2025-01', value: 2400 },
    { date: '2025-02', value: 1398 },
    { date: '2025-03', value: 9800 },
    { date: '2025-04', value: 3908 },
    { date: '2025-05', value: 4800 },
    { date: '2025-06', value: 3800 },
  ],
  clicks: [
    { date: '2025-01', value: 4000 },
    { date: '2025-02', value: 3000 },
    { date: '2025-03', value: 2000 },
    { date: '2025-04', value: 2780 },
    { date: '2025-05', value: 1890 },
    { date: '2025-06', value: 2390 },
  ],
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  delay?: number;
}

function StatCard({ title, value, change, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">{change}</span>
        </div>
      </Card>
    </motion.div>
  );
}

export function Overview() {
  return (
    <div className="space-y-8">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening.
          </p>
        </div>
      </div> */}
      <DashboardHeader
        title="Dashboard"
        tagline="Welcome back! Here's what's happening."
        showButton={false}
      ></DashboardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value="0"
          change="+0% from last month"
          icon={<Coins className="w-6 h-6 text-purple-600" />}
          delay={0.1}
        />
        <StatCard
          title="Total Clicks"
          value="0"
          change="+0% from last month"
          icon={<MousePointer className="w-6 h-6 text-blue-500" />}
          delay={0.2}
        />
        <StatCard
          title="Active Brands"
          value="0"
          change="+0% from last month"
          icon={<Users className="w-6 h-6 text-pink-500" />}
          delay={0.3}
        />
        <StatCard
          title="Active Offers"
          value="0"
          change="+0% from last month"
          icon={<Ticket className="w-6 h-6 text-teal-500" />}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.earnings}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    axisLine={{ stroke: '#374151' }}
                    tickLine={{ stroke: '#374151' }}
                    scale="band"
                    fontSize={12}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Click Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.clicks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    axisLine={{ stroke: '#374151' }}
                    tickLine={{ stroke: '#374151' }}
                    scale="band"
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
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
        </motion.div>
      </div>
    </div>
  );
}
