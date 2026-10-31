import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { Invoice } from '../../types';
import {
  FileSpreadsheet,
  Users,
  Repeat,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffOverview: React.FC = () => {
  const {
    customers,
    quotations,
    subscriptions,
    invoices,
    currentUser,
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const pendingQuotations = quotations.filter((q) => q.status === 'SENT' || q.status === 'ACCEPTED');
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');
  const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE' || (i.outstandingAmount > 0 && new Date(i.dueDate) < new Date()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Account Management & Sales Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as {currentUser.name} · Assigned desk: {currentUser.department || 'Client Services'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/staff/quotations"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quotation</span>
          </Link>
        </div>
      </div>

      {/* Staff Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Customer Directory
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{customers.length}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Managed corporate accounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
            Active Proposals
          </span>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{pendingQuotations.length}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Pending conversion</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
            Live Subscriptions
          </span>
          <p className="text-2xl font-bold font-mono text-indigo-700 mt-1">{activeSubs.length}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Generating recurring billing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
            Overdue Receivables
          </span>
          <p className="text-2xl font-bold font-mono text-rose-600 mt-1">{overdueInvoices.length}</p>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">Requires dunning follow-up</span>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/staff/customers"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Manage Customers</h3>
            <p className="text-[11px] text-slate-500">View client profiles, history & contacts</p>
          </div>
        </Link>

        <Link
          to="/staff/quotations"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Quotations Desk</h3>
            <p className="text-[11px] text-slate-500">Issue custom proposals & convert to subs</p>
          </div>
        </Link>

        <Link
          to="/staff/operations"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Record Payments</h3>
            <p className="text-[11px] text-slate-500">Log bank wires, UTRs & UPI receipts</p>
          </div>
        </Link>
      </div>

      {/* Grid: Pending Proposals & Overdue Collection Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposals Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Quotations ({quotations.length})
            </h3>
            <Link to="/staff/quotations" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Manage all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {quotations.map((q) => {
              const cust = customers.find((c) => c.id === q.customerId);
              return (
                <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700">{q.quotationNumber}</span>
                      <StatusBadge status={q.status} size="sm" />
                    </div>
                    <p className="font-semibold text-slate-900 mt-1">{cust?.company}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Valid until: {formatDate(q.validUntil)}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">{formatCurrency(q.grandTotal)}</span>
                    {q.status === 'ACCEPTED' ? (
                      <Link
                        to="/staff/quotations"
                        className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                      >
                        Convert to Sub →
                      </Link>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-1 block">Awaiting Acceptance</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices requiring payment logging */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Invoices Awaiting Settlement
            </h3>
            <Link to="/staff/operations" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View operations
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {invoices
              .filter((i) => i.outstandingAmount > 0)
              .slice(0, 5)
              .map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                return (
                  <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700">{inv.invoiceNumber}</span>
                        <StatusBadge status={inv.status} size="sm" />
                      </div>
                      <p className="font-semibold text-slate-900 mt-1">{cust?.company}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Due date: {formatDate(inv.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 block">
                        {formatCurrency(inv.outstandingAmount)}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPaymentModalOpen(true);
                        }}
                        className="mt-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                      >
                        Record Payment
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <RecordPaymentModal
        invoice={selectedInvoice}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};
