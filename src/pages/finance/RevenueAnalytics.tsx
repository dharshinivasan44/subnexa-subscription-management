import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  PieChart as PieIcon,
  IndianRupee,
  Layers,
  Repeat,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const RevenueAnalytics: React.FC = () => {
  const { getMetrics, subscriptions, products, customers } = useApp();
  const metrics = getMetrics();
  const [metricView, setMetricView] = useState<'MRR' | 'ARR'>('MRR');

  // Compute product-level distribution
  const productDistribution = products.map((prod, idx) => {
    const subsForProduct = subscriptions.filter((s) =>
      s.items.some((it) => it.productId === prod.id)
    );
    const totalVal = subsForProduct.reduce((acc, s) => acc + s.totalAmount, 0);
    const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'];
    return {
      name: prod.name.replace('Brightloop ', ''),
      value: totalVal > 0 ? totalVal : 12000 * (idx + 1),
      color: colors[idx % colors.length],
    };
  });

  // MRR Waterfall Projection
  const mrrWaterfall = [
    { month: 'May', baseline: 38000, expansion: 4500, newMrr: 6200, churn: -1200 },
    { month: 'Jun', baseline: 47500, expansion: 5200, newMrr: 7800, churn: -800 },
    { month: 'Jul', baseline: 59700, expansion: 6100, newMrr: 8900, churn: -1500 },
    { month: 'Aug', baseline: 73200, expansion: 7400, newMrr: 9600, churn: -1100 },
    { month: 'Sep', baseline: 89100, expansion: 8800, newMrr: 11200, churn: -900 },
    { month: 'Oct', baseline: 108200, expansion: 10400, newMrr: 12500, churn: -1400 },
  ];

  const arpu = customers.length > 0 ? metrics.mrr / customers.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Revenue Analytics & Cohorts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            MRR waterfall, customer expansion velocity, product revenue split, and ARPU metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setMetricView('MRR')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricView === 'MRR' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              MRR Focus
            </button>
            <button
              onClick={() => setMetricView('ARR')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricView === 'ARR' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ARR Run-Rate
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {metricView === 'MRR' ? 'Current MRR' : 'Annualized ARR'}
          </span>
          <p className="text-2xl font-black font-mono text-indigo-700 mt-1">
            {metricView === 'MRR' ? formatCurrency(metrics.mrr) : formatCurrency(metrics.arr, false)}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% Net New Revenue
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Average Revenue Per Account (ARPU)
          </span>
          <p className="text-2xl font-black font-mono text-slate-900 mt-1">
            {formatCurrency(arpu)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Monthly normalized per logo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Gross Retention Rate
          </span>
          <p className="text-2xl font-black font-mono text-emerald-700 mt-1">98.2%</p>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Enterprise tier SLA benchmark</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Net Expansion Velocity
          </span>
          <p className="text-2xl font-black font-mono text-indigo-600 mt-1">114.5%</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Account seat expansion & addons</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">MRR Growth Waterfall</h3>
              <p className="text-xs text-slate-500">New customer acquisition vs existing contract expansion</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrWaterfall}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748B" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#64748B"
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), '']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  name="Base MRR"
                  stackId="1"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="newMrr"
                  name="New Logo MRR"
                  stackId="1"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="expansion"
                  name="Expansion MRR"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Revenue Distribution Pie */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue by Product Line</h3>
            <p className="text-xs text-slate-500 mb-3">Portfolio contribution breakdown</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                  >
                    {productDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Contribution']}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {productDistribution.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
