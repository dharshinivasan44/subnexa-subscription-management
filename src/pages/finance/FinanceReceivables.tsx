import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import {
  AlertOctagon,
  Clock,
  Printer,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export const FinanceReceivables: React.FC = () => {
  const { invoices, customers } = useApp();

  const [search, setSearch] = useState('');
  const [agingFilter, setAgingFilter] = useState('ALL');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const openInvoices = invoices.filter(
    (inv) => inv.outstandingAmount > 0 && inv.status !== 'CANCELLED'
  );

  // Compute days overdue helper
  const getDaysOverdue = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Aging buckets
  const currentTotal = openInvoices
    .filter((i) => getDaysOverdue(i.dueDate) === 0)
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  const overdue1to15Total = openInvoices
    .filter((i) => {
      const d = getDaysOverdue(i.dueDate);
      return d >= 1 && d <= 15;
    })
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  const overdue16to30Total = openInvoices
    .filter((i) => {
      const d = getDaysOverdue(i.dueDate);
      return d >= 16 && d <= 30;
    })
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  const overdue30PlusTotal = openInvoices
    .filter((i) => getDaysOverdue(i.dueDate) > 30)
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  const filteredInvoices = openInvoices.filter((inv) => {
    const cust = customers.find((c) => c.id === inv.customerId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (cust && cust.company.toLowerCase().includes(search.toLowerCase()));

    const days = getDaysOverdue(inv.dueDate);
    let matchesAging = true;
    if (agingFilter === 'CURRENT') matchesAging = days === 0;
    else if (agingFilter === '1_15') matchesAging = days >= 1 && days <= 15;
    else if (agingFilter === '16_30') matchesAging = days >= 16 && days <= 30;
    else if (agingFilter === '30_PLUS') matchesAging = days > 30;

    return matchesSearch && matchesAging;
  });

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
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Receivables Ledger & Overdue Aging Analysis
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed aging buckets, customer delinquency tracking, and direct debt recovery settlement.
        </p>
      </div>

      {/* Aging Summary Buckets Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Bucket 1: Current */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Current (Not Due)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-2">{formatCurrency(currentTotal)}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Within agreed payment terms</span>
        </div>

        {/* Bucket 2: 1-15 Days Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">1 - 15 Days Overdue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-700 mt-2">{formatCurrency(overdue1to15Total)}</p>
          <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">Automated dunning alert sent</span>
        </div>

        {/* Bucket 3: 16-30 Days Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">16 - 30 Days Overdue</span>
            <AlertOctagon className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-bold font-mono text-orange-700 mt-2">{formatCurrency(overdue16to30Total)}</p>
          <span className="text-[10px] text-orange-600 font-medium mt-0.5 block">Account rep telephone follow-up</span>
        </div>

        {/* Bucket 4: 30+ Days Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">30+ Days Delinquent</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold font-mono text-rose-600 mt-2">{formatCurrency(overdue30PlusTotal)}</p>
          <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">Service suspension warning</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search overdue invoice #, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Aging Bucket:</span>
          <select
            value={agingFilter}
            onChange={(e) => setAgingFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Receivables ({openInvoices.length})</option>
            <option value="CURRENT">Current (Not Due)</option>
            <option value="1_15">1 - 15 Days Overdue</option>
            <option value="16_30">16 - 30 Days Overdue</option>
            <option value="30_PLUS">30+ Days Overdue</option>
          </select>
        </div>
      </div>

      {/* Receivables Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Customer Entity</th>
              <th className="py-3 px-4">Payment Due</th>
              <th className="py-3 px-4">Days Overdue</th>
              <th className="py-3 px-4 text-right">Invoice Amount</th>
              <th className="py-3 px-4 text-right">Outstanding Balance</th>
              <th className="py-3 px-4 text-right">Settlement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => {
              const cust = customers.find((c) => c.id === inv.customerId);
              const days = getDaysOverdue(inv.dueDate);
              return (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{cust?.company}</p>
                    <p className="text-[11px] text-slate-500">{cust?.email}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 px-4 font-mono">
                    {days === 0 ? (
                      <span className="text-emerald-700 font-semibold">Current (0d)</span>
                    ) : (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {days} days overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">{formatCurrency(inv.totalAmount)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 text-sm">
                    {formatCurrency(inv.outstandingAmount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenPrint(inv)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Print / View Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenPayment(inv)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors shadow-xs cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
