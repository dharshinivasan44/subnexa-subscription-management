import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InvoicePrintModal } from '../../components/invoices/InvoicePrintModal';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { Invoice } from '../../types';
import {
  Receipt,
  Play,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  FileText,
  CreditCard,
  Printer,
  Clock,
  Layers,
} from 'lucide-react';

export const BillingCenter: React.FC = () => {
  const {
    subscriptions,
    invoices,
    customers,
    billingLogs,
    runRecurringBilling,
    addToast,
  } = useApp();

  // Target billing date selector - default to today or 2026-11-01
  const [targetDate, setTargetDate] = useState<string>('2026-11-01');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{
    processed: number;
    generated: number;
    skipped: number;
    totalAmount: number;
  } | null>(null);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Find candidate subscriptions due on or before targetDate
  const candidateSubs = subscriptions.filter(
    (s) => (s.status === 'ACTIVE' || s.status === 'CONFIRMED') && s.nextBillingDate <= targetDate
  );

  // Check how many of candidateSubs are already invoiced for this cycle
  const duplicateSubs = candidateSubs.filter((sub) => {
    const cycleKey = `${sub.id}_${sub.nextBillingDate}`;
    return invoices.some((inv) => inv.billingCycleKey === cycleKey);
  });

  const dueForRun = candidateSubs.length - duplicateSubs.length;

  const handleRunBilling = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const result = runRecurringBilling(targetDate);
        setLastResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsRunning(false);
      }
    }, 400);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Recurring Billing & Execution Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated recurring cycle invoice batch generator with idempotent cycle key deduplication.
          </p>
        </div>
      </div>

      {/* Execution Console Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Idempotent Engine v1.0
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">Trigger Scheduled Billing Cycle</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Select the billing cut-off date to evaluate active subscriptions. The engine computes taxes, auto-applies
              eligible promotions, advances subscriber renewal dates, and guards against duplicate billing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setLastResult(null);
                }}
                className="bg-transparent font-mono text-xs font-semibold text-slate-800 outline-hidden"
              />
            </div>

            <button
              onClick={handleRunBilling}
              disabled={isRunning}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Processing Cycle...' : 'Run Billing'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Subs Due
            </span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
              {candidateSubs.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Targeted on or before date</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              New Invoices Ready
            </span>
            <span className="text-2xl font-black font-mono text-emerald-700 mt-1 block">{dueForRun}</span>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Pending generation</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
              Duplicates Skipped
            </span>
            <span className="text-2xl font-black font-mono text-amber-700 mt-1 block">
              {duplicateSubs.length}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Already billed for this cycle</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
              Idempotency Key
            </span>
            <span className="text-xs font-mono font-bold text-indigo-900 mt-2 block truncate">
              sub-id_{targetDate}
            </span>
            <span className="text-[10px] text-indigo-600 mt-0.5 block">Collision protection active</span>
          </div>
        </div>

        {/* Feedback message banner after run */}
        {lastResult && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">
                  Billing Execution Succeeded: {lastResult.generated} invoice(s) generated (
                  {formatCurrency(lastResult.totalAmount)}).
                </p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Skipped {lastResult.skipped} already-processed cycles. Subscriptions updated with advanced billing dates.
                </p>
              </div>
            </div>
            <span className="font-mono text-emerald-800 text-[11px] font-semibold bg-emerald-100 px-2 py-1 rounded">
              0 Errors
            </span>
          </div>
        )}
      </div>

      {/* Generated Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Invoices Generated by Billing Engine</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">{invoices.length} Total Invoices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cycle Period</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Total (Incl. Tax)</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{cust?.company || 'Subscriber'}</p>
                      <p className="text-[11px] text-slate-500">{cust?.name}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatDate(inv.billingPeriodStart)} - {formatDate(inv.billingPeriodEnd)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {formatCurrency(inv.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
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
                          title="View & Print Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {inv.outstandingAmount > 0 && (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                          >
                            Pay
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
      </div>

      {/* Execution Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Billing Run Audit Log</h3>
          </div>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-2.5 px-4">Run Timestamp</th>
              <th className="py-2.5 px-4">Target Date</th>
              <th className="py-2.5 px-4">Triggered By</th>
              <th className="py-2.5 px-4 text-center">Invoices Created</th>
              <th className="py-2.5 px-4 text-center">Duplicates Prevented</th>
              <th className="py-2.5 px-4 text-right">Value Billed</th>
              <th className="py-2.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {billingLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 font-mono text-[11px]">
                <td className="py-2.5 px-4 text-slate-700">{formatDateTime(log.runDate)}</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{log.targetDate}</td>
                <td className="py-2.5 px-4 text-slate-600">{log.executedBy}</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">
                  {log.invoicesGeneratedCount}
                </td>
                <td className="py-2.5 px-4 text-center text-amber-600 font-bold">
                  {log.skippedDuplicatesCount}
                </td>
                <td className="py-2.5 px-4 text-right font-bold text-indigo-700">
                  {formatCurrency(log.totalBilledAmount)}
                </td>
                <td className="py-2.5 px-4 text-slate-500 font-sans text-xs">{log.details}</td>
              </tr>
            ))}
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
