import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { X, CreditCard, Check, IndianRupee } from 'lucide-react';

interface RecordPaymentModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { recordPayment, customers } = useApp();

  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NEFT_RTGS' | 'CREDIT_CARD' | 'NET_BANKING' | 'CHEQUE'>('UPI');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.outstandingAmount > 0 ? invoice.outstandingAmount : invoice.totalAmount);
      setReferenceNumber(`UTR-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const customer = customers.find((c) => c.id === invoice.customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsSubmitting(true);
    try {
      recordPayment({
        invoiceId: invoice.id,
        amount: Number(amount),
        paymentMethod,
        referenceNumber: referenceNumber || `REF-${Date.now()}`,
        paymentDate,
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayFull = () => {
    setAmount(invoice.outstandingAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h2 className="font-semibold text-base">Record Payment Receipt</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Strip */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center text-xs">
          <div>
            <p className="font-mono font-bold text-slate-900 text-sm">{invoice.invoiceNumber}</p>
            <p className="text-slate-500 mt-0.5">{customer?.company || customer?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Remaining Balance</p>
            <p className="font-mono font-bold text-rose-600 text-sm">{formatCurrency(invoice.outstandingAmount)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Payment Amount (₹)</label>
              <button
                type="button"
                onClick={handlePayFull}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Full Balance ({formatCurrency(invoice.outstandingAmount)})
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                min="1"
                max={invoice.outstandingAmount * 2}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>
            {amount > invoice.outstandingAmount && (
              <p className="text-xs text-amber-600 mt-1">Note: Amount exceeds current outstanding balance.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="NEFT_RTGS">NEFT / RTGS Wire</option>
                <option value="CREDIT_CARD">Credit Card / Gateway</option>
                <option value="NET_BANKING">Net Banking (IMPS)</option>
                <option value="CHEQUE">Cheque / Demand Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Date</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transaction / UTR Reference</label>
            <input
              type="text"
              required
              placeholder="e.g. UPI/6281092837 or RTGS-HDFC192830"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Internal Remarks / Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Verified in HDFC current account CMS portal."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Record {formatCurrency(amount)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
