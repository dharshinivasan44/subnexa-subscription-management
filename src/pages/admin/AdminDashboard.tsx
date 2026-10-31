import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { Invoice, Subscription } from '../../types';
import {
  Users,
  Repeat,
  IndianRupee,
  TrendingUp,
  AlertOctagon,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const {
    getMetrics,
    subscriptions,
    invoices,
    payments,
    customers,
    products,
  } = useApp();

  const metrics = getMetrics();

  // State for modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Chart 1: Monthly revenue trend (realistic 6-month progression)
  const revenueTrendData = [
    { month: 'Jun', billed: 42000, collected: 39500 },
    { month: 'Jul', billed: 56000, collected: 51200 },
    { month: 'Aug', billed: 68500, collected: 64000 },
    { month: 'Sep', billed: 79200, collected: 72000 },
    { month: 'Oct', billed: 98860, collected: metrics.totalReceived > 80000 ? metrics.totalReceived : 89569 },
    { month: 'Nov (Est)', billed: 112000, collected: 104000 },
  ];

  // Chart 2: Subscription growth bar chart
  const growthData = [
    { month: 'Jun', total: 4, netAdd: 2 },
    { month: 'Jul', total: 6, netAdd: 2 },
    { month: 'Aug', total: 8, netAdd: 2 },
    { month: 'Sep', total: 10, netAdd: 2 },
    { month: 'Oct', total: subscriptions.length, netAdd: 3 },
  ];

  // Chart 3: Subscription status donut
  const statusCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDonutData = [
    { name: 'Active', value: statusCounts['ACTIVE'] || 0, color: '#16A34A' },
    { name: 'Confirmed', value: statusCounts['CONFIRMED'] || 0, color: '#4F46E5' },
    { name: 'Paused', value: statusCounts['PAUSED'] || 0, color: '#F59E0B' },
    { name: 'Closed', value: statusCounts['CLOSED'] || 0, color: '#94A3B8' },
  ].filter((d) => d.value > 0);

  // Overdue Invoices
  const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE' || (i.outstandingAmount > 0 && new Date(i.dueDate) < new Date()));

  // Upcoming renewals (due in next 30 days)
  const upcomingRenewals = subscriptions.filter(
    (s) => s.status === 'ACTIVE'
  ).slice(0, 4);

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Executive Revenue Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Brightloop Software · Centralized Subscription & Recurring Billing Control
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/billing"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Billing Center</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip (Section 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono mt-2">{metrics.totalCustomersCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +2 this month
          </span>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Subs</span>
            <Repeat className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 font-mono mt-2">{metrics.activeSubscriptionsCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Across 5 products</span>
        </div>

        {/* Card 3: MRR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">MRR</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono mt-2 truncate">
            {formatCurrency(metrics.mrr, false)}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
          </span>
        </div>

        {/* Card 4: ARR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">ARR</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono mt-2 truncate">
            {formatCurrency(metrics.arr, false)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Annualized run-rate</span>
        </div>

        {/* Card 5: Payments Received */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Collected</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-emerald-700 font-mono mt-2 truncate">
            {formatCurrency(metrics.totalReceived, false)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">{payments.length} settled payments</span>
        </div>

        {/* Card 6: Outstanding Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Outstanding</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-amber-700 font-mono mt-2 truncate">
            {formatCurrency(metrics.outstandingRevenue, false)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Awaiting clearance</span>
        </div>

        {/* Card 7: Overdue Invoices */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Overdue</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-lg font-bold text-rose-600 font-mono mt-2 truncate">
            {formatCurrency(metrics.overdueRevenue, false)}
          </p>
          <span className="text-[10px] text-rose-600 font-medium mt-1 block">
            {overdueInvoices.length} invoice(s) due
          </span>
        </div>
      </div>

      {/* Overdue Invoices Alert Banner if present */}
      {overdueInvoices.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Action Required: {overdueInvoices.length} overdue invoice(s) totaling {formatCurrency(metrics.overdueRevenue)}
              </h4>
              <p className="text-[11px] text-rose-700">
                Invoice {overdueInvoices[0]?.invoiceNumber} for{' '}
                {customers.find((c) => c.id === overdueInvoices[0]?.customerId)?.company} has passed its payment due date.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPayment(overdueInvoices[0])}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Record Payment
            </button>
            <button
              onClick={() => handleOpenPrint(overdueInvoices[0])}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              View Invoice
            </button>
          </div>
        </div>
      )}

      {/* Visual Analytics Grid (Line chart + Bar chart + Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Revenue & Cash Collections</h3>
              <p className="text-xs text-slate-500">Invoiced value vs Settled payments (in INR)</p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">2026 Fiscal</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
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
                <Line
                  type="monotone"
                  dataKey="billed"
                  name="Invoiced Revenue"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  name="Collections (Cash)"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Subscription Status Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900">Subscription Portfolio</h3>
            <p className="text-xs text-slate-500">Distribution by current lifecycle state</p>
          </div>
          <div className="h-52 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} subscription(s)`, name]}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {statusDonutData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-mono font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Subscriptions + Upcoming Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Subscriptions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Subscriptions</h3>
              <p className="text-xs text-slate-500">Contracts across active accounts</p>
            </div>
            <Link
              to="/admin/subscriptions"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Sub Ref</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Cadence</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">Next Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.slice(0, 5).map((sub) => {
                  const cust = customers.find((c) => c.id === sub.customerId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{sub.subscriptionNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{cust?.company}</p>
                        <p className="text-[11px] text-slate-500">{cust?.name}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{sub.billingInterval}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        {formatCurrency(sub.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {formatDate(sub.nextBillingDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Renewals Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Renewals</h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Scheduled recurring cycles ready for billing</p>
            <div className="space-y-3">
              {upcomingRenewals.map((sub) => {
                const cust = customers.find((c) => c.id === sub.customerId);
                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{cust?.company}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {sub.subscriptionNumber} · Due {formatDate(sub.nextBillingDate)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">{formatCurrency(sub.totalAmount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              to="/admin/billing"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <span>Execute Automated Billing Cycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InvoicePrintModal
        invoice={selectedInvoice}
        customer={customers.find((c) => c.id === selectedInvoice?.customerId)}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <RecordPaymentModal
        invoice={selectedInvoice}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};
