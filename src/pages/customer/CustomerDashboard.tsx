import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { Invoice } from '../../types';
import {
  Repeat,
  Receipt,
  CreditCard,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    customers,
    products,
    subscriptions,
    invoices,
    payments,
  } = useApp();

  // Enforce customer privacy: strictly get this customer's data only
  const activeCustomerId = currentUser.customerId || 'cust-1';
  const customer = customers.find((c) => c.id === activeCustomerId);

  const mySubs = subscriptions.filter((s) => s.customerId === activeCustomerId);
  const myInvoices = invoices.filter((i) => i.customerId === activeCustomerId);
  const myPayments = payments.filter((p) => p.customerId === activeCustomerId);

  const activeSubCount = mySubs.filter((s) => s.status === 'ACTIVE').length;
  const outstandingTotal = myInvoices
    .filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED')
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  // Next renewal
  const activeSub = mySubs.find((s) => s.status === 'ACTIVE');
  const nextBillingDate = activeSub?.nextBillingDate || '—';

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {customer?.company?.charAt(0) || 'C'}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
              Customer Self-Service Portal
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Welcome back, {customer?.name || currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {customer?.company} · GSTIN: <span className="font-mono">{customer?.gstin || '27AAACZ1234D1Z5'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/portal/invoices"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>View All Invoices</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Subscriptions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Subscriptions</span>
            <Repeat className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black font-mono text-slate-900 mt-2">{activeSubCount}</p>
          <span className="text-xs text-slate-500 mt-1 block">Live enterprise deployments</span>
        </div>

        {/* Next Scheduled Billing Date */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Renewal Date</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">{formatDate(nextBillingDate)}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">Auto-renewal enabled</span>
        </div>

        {/* Outstanding Invoice Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Balance Due</span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black font-mono text-slate-900 mt-2">
            {formatCurrency(outstandingTotal)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {outstandingTotal > 0 ? 'Awaiting wire / UPI settlement' : 'Account in good standing'}
          </span>
        </div>
      </div>

      {/* Row: Subscriptions + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Subscriptions List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">My Active Subscriptions</h3>
            <Link to="/portal/subscriptions" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Manage plans
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {mySubs.map((sub) => {
              const prod = products.find((p) => p.id === sub.items[0]?.productId);
              return (
                <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700">{sub.subscriptionNumber}</span>
                      <StatusBadge status={sub.status} size="sm" />
                    </div>
                    <p className="font-medium text-slate-900 mt-1">
                      {prod?.name || 'Brightloop Enterprise Cloud'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Cadence: {sub.billingInterval} · Next Cycle: {formatDate(sub.nextBillingDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block text-sm">
                      {formatCurrency(sub.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">/{sub.billingInterval.toLowerCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Tax Invoices</h3>
            <Link to="/portal/invoices" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {myInvoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Date: {formatDate(inv.invoiceDate)} · Due: {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                    {inv.outstandingAmount > 0 && (
                      <span className="text-[10px] text-rose-600 font-mono">
                        Due: {formatCurrency(inv.outstandingAmount)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenPrint(inv)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    title="Print / View Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <InvoicePrintModal
        invoice={selectedInvoice}
        customer={customer}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
