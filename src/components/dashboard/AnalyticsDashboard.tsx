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
} from 'recharts';
import { supabase } from '@/lib/supabase';

type ClickData = {
  date: string;
  clicks: number;
  revenue: number;
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const { data: clicks, error } = await supabase
        .from('clicks')
        .select(`
          *,
          ad_distributions (
            ad_id,
            ads (
              ppc_rate
            )
          )
        `)
        .eq('is_fraudulent', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data for chart
      const processedData = clicks.reduce((acc: Record<string, ClickData>, click) => {
        const date = new Date(click.created_at).toISOString().split('T')[0];
        const ppcRate = click.ad_distributions?.ads?.ppc_rate || 0;

        if (!acc[date]) {
          acc[date] = { date, clicks: 0, revenue: 0 };
        }

        acc[date].clicks++;
        acc[date].revenue += ppcRate;

        return acc;
      }, {});

      setData(Object.values(processedData));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="w-full h-[400px] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-[100px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalClicks = data.reduce((sum, day) => sum + day.clicks, 0);
  const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
  const avgClicksPerDay = totalClicks / (data.length || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Clicks</h3>
          <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Avg. Daily Clicks</h3>
          <p className="text-2xl font-bold">{avgClicksPerDay.toFixed(1)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Over Time</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                scale="band"
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}