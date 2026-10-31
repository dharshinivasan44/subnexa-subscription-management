import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, Subscription } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import {
  CalendarCheck2,
  Receipt,
  CreditCard,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffOperations: React.FC = () => {
  const {
    invoices,
    subscriptions,
    customers,
    updateInvoiceStatus,
    updateSubscriptionStatus,
    runRecurringBilling,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'INVOICES' | 'SUBSCRIPTIONS'>('INVOICES');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const cust = customers.find((c) => c.id === inv.customerId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (cust && cust.company.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmInvoice = (inv: Invoice) => {
    updateInvoiceStatus(inv.id, 'CONFIRMED');
    addToast({
      type: 'success',
      title: 'Invoice Confirmed',
      message: `${inv.invoiceNumber} confirmed and dispatched to customer portal.`,
    });
  };

  const handleCancelInvoice = (inv: Invoice) => {
    updateInvoiceStatus(inv.id, 'CANCELLED');
    addToast({
      type: 'info',
      title: 'Invoice Cancelled',
      message: `${inv.invoiceNumber} has been voided.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Subscription & Billing Operations Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational invoice fulfillment, payment recording, dunning monitoring, and subscriber servicing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/billing"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Recurring Billing Center</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('INVOICES');
            setStatusFilter('ALL');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'INVOICES'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices & Payment Operations ({invoices.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('SUBSCRIPTIONS');
            setStatusFilter('ALL');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'SUBSCRIPTIONS'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Subscription Operations ({subscriptions.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            {activeTab === 'INVOICES' ? (
              <>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </>
            ) : (
              <>
                <option value="ACTIVE">Active</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAUSED">Paused</option>
                <option value="CLOSED">Closed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* TAB 1: INVOICES & PAYMENTS */}
      {activeTab === 'INVOICES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice / Due Date</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Invoiced Total</th>
                <th className="py-3 px-4 text-right">Paid Amount</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{cust?.company || 'Subscriber'}</p>
                      <p className="text-[11px] text-slate-500">{cust?.name}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <p>{formatDate(inv.invoiceDate)}</p>
                      <span className="text-[10px] text-slate-400">Due: {formatDate(inv.dueDate)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={inv.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {formatCurrency(inv.outstandingAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPrint(inv)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Print / Export PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {inv.status === 'DRAFT' && (
                          <button
                            onClick={() => handleConfirmInvoice(inv)}
                            className="px-2 py-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}

                        {inv.outstandingAmount > 0 && inv.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors shadow-xs cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Record Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTIONS */}
      {activeTab === 'SUBSCRIPTIONS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Subscription #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cadence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Next Billing Date</th>
                <th className="py-3 px-4 text-right">Recurring Value</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((sub) => {
                const cust = customers.find((c) => c.id === sub.customerId);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{sub.subscriptionNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{cust?.company}</p>
                      <p className="text-[11px] text-slate-500">{cust?.name}</p>
                    </td>
                    <td className="py-3 px-4 font-mono">{sub.billingInterval}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{formatDate(sub.nextBillingDate)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(sub.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {sub.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'ACTIVE')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'PAUSED')}
                          className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200 cursor-pointer"
                        >
                          Pause
                        </button>
                      )}
                      {sub.status === 'PAUSED' && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'ACTIVE')}
                          className="px-2 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md cursor-pointer"
                        >
                          Resume
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
