import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { Invoice } from '../../types';
import {
  PieChart as PieIcon,
  TrendingUp,
  IndianRupee,
  Clock,
  AlertOctagon,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const FinanceOverview: React.FC = () => {
  const {
    getMetrics,
    invoices,
    subscriptions,
    payments,
    customers,
  } = useApp();

  const metrics = getMetrics();
  const [dateRange, setDateRange] = useState('YTD');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Financial trend data
  const financialTrend = [
    { period: 'Q1 2026', invoiced: 110000, collections: 105000, mrr: 35000 },
    { period: 'Q2 2026', invoiced: 145000, collections: 138000, mrr: 48000 },
    { period: 'Q3 2026', invoiced: 198000, collections: 185000, mrr: 66000 },
    { period: 'Q4 2026', invoiced: 242000, collections: metrics.totalReceived > 200000 ? metrics.totalReceived : 228000, mrr: metrics.mrr },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Financial Treasury & Revenue Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Brightloop Software · Cash flow velocity, MRR run-rate, and statutory receivables ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-700 outline-hidden"
          >
            <option value="MTD">Month to Date (Oct 2026)</option>
            <option value="QTD">Quarter to Date (Q4 2026)</option>
            <option value="YTD">Year to Date (FY 2026-27)</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Grid (Section 17) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">MRR Velocity</span>
          <p className="text-lg font-bold font-mono text-slate-900 mt-2 truncate">
            {formatCurrency(metrics.mrr)}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Annualized Run-Rate</span>
          <p className="text-lg font-bold font-mono text-slate-900 mt-2 truncate">
            {formatCurrency(metrics.arr, false)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">MRR × 12 annualized</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Cash Received</span>
          <p className="text-lg font-bold font-mono text-emerald-700 mt-2 truncate">
            {formatCurrency(metrics.totalReceived)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">{payments.length} settled receipts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Outstanding AR</span>
          <p className="text-lg font-bold font-mono text-amber-700 mt-2 truncate">
            {formatCurrency(metrics.outstandingRevenue)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Awaiting bank settlement</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Overdue Receivables</span>
          <p className="text-lg font-bold font-mono text-rose-600 mt-2 truncate">
            {formatCurrency(metrics.overdueRevenue)}
          </p>
          <span className="text-[10px] text-rose-600 font-medium mt-1 block">Dunning cycle active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Active Contracts</span>
          <p className="text-lg font-bold font-mono text-indigo-700 mt-2">{metrics.activeSubscriptionsCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Across {customers.length} companies</span>
        </div>
      </div>

      {/* Chart: Quarterly Invoiced vs Cash Collections */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Invoiced Revenue vs Cash Collections</h3>
            <p className="text-xs text-slate-500">Gross billing commitments vs real liquidity collected</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">Fiscal 2026-27</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#64748B" />
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
              <Bar dataKey="invoiced" name="Invoiced Revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collections" name="Cash Settled" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Receivables Snapshot Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Open Receivables Ledger</h3>
          <span className="text-xs font-mono text-slate-500">
            {invoices.filter((i) => i.outstandingAmount > 0).length} Unsettled Accounts
          </span>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-2.5 px-4">Invoice #</th>
              <th className="py-2.5 px-4">Customer Entity</th>
              <th className="py-2.5 px-4">Due Date</th>
              <th className="py-2.5 px-4">Aging Status</th>
              <th className="py-2.5 px-4 text-right">Invoiced Total</th>
              <th className="py-2.5 px-4 text-right">Outstanding Balance</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices
              .filter((i) => i.outstandingAmount > 0)
              .map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{cust?.company || 'Subscriber'}</p>
                      <p className="text-[11px] text-slate-500">{cust?.name}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatDate(inv.dueDate)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {formatCurrency(inv.outstandingAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer"
                      >
                        Record Pay
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <RecordPaymentModal
        invoice={selectedInvoice}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};
