import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { Invoice } from '../../types';
import { Receipt, Printer, Search, Download, ShieldCheck, CreditCard } from 'lucide-react';

export const CustomerInvoices: React.FC = () => {
  const { currentUser, customers, invoices } = useApp();

  const customerId = currentUser.customerId || 'cust-1';
  const customer = customers.find((c) => c.id === customerId);
  const myInvoices = invoices.filter((i) => i.customerId === customerId);

  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredInvoices = myInvoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Tax Invoices & Billing History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View generated tax invoices, GST breakdowns, settlement statuses, and download official PDF tax invoices.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
          />
        </div>
        <span className="text-xs font-mono text-slate-500">{filteredInvoices.length} Invoices</span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Billing Period</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Tax (GST)</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-right">Outstanding</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {formatDate(inv.billingPeriodStart)} - {formatDate(inv.billingPeriodEnd)}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">{formatDate(inv.invoiceDate)}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{formatDate(inv.dueDate)}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={inv.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-600">{formatCurrency(inv.taxAmount)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(inv.totalAmount)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold">
                  <span className={inv.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    {formatCurrency(inv.outstandingAmount)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleOpenPrint(inv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Print Modal */}
      <InvoicePrintModal
        invoice={selectedInvoice}
        customer={customer}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
