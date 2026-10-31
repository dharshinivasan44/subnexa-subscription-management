import React from 'react';
import { Invoice, Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { Printer, X, Download, ShieldCheck, Building2, CreditCard } from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  customer: Customer | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  customer,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide">Tax Invoice Preview</span>
            <span className="text-slate-400 text-xs font-mono">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 md:p-12 text-slate-800 bg-white" id="invoice-sheet">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-8 gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-950">Subnexa</h1>
                  <p className="text-xs text-slate-500 font-medium">Brightloop Software Technologies Pvt Ltd</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p>Tower 4, Level 9, Cyber City</p>
                <p>Bengaluru, Karnataka - 560103, India</p>
                <p>
                  <span className="font-semibold text-slate-700">GSTIN:</span> 29AAACB8921J1Z8
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Email:</span> billing@brightloop.io
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-2xl font-black text-indigo-700 tracking-wider">TAX INVOICE</span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1">{invoice.invoiceNumber}</p>
              <div className="mt-3 inline-block">
                <StatusBadge status={invoice.status} />
              </div>
              <div className="mt-4 text-xs text-slate-600 space-y-1 font-mono">
                <p>
                  <span className="text-slate-500">Invoice Date:</span> {formatDate(invoice.invoiceDate)}
                </p>
                <p>
                  <span className="text-slate-500">Payment Due:</span> {formatDate(invoice.dueDate)}
                </p>
                <p>
                  <span className="text-slate-500">Billing Cycle:</span> {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                </p>
              </div>
            </div>
          </div>

          {/* Billed To / Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Billed To</h3>
              <p className="text-base font-bold text-slate-900 mt-1">{customer?.company || 'Valued Subscriber'}</p>
              <p className="text-sm text-slate-700 font-medium mt-0.5">Attn: {customer?.name}</p>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p>{customer?.address || 'Corporate Headquarters'}</p>
                <p>{customer?.city}, {customer?.state} - {customer?.pincode}</p>
                {customer?.gstin && (
                  <p className="font-mono mt-1">
                    <span className="font-semibold text-slate-700">Client GSTIN:</span> {customer.gstin}
                  </p>
                )}
                <p>Email: {customer?.email}</p>
                <p>Phone: {customer?.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Subscription Details</span>
              </h3>
              <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Ref:</span>
                  <span className="font-mono font-medium">{invoice.subscriptionId || 'On-demand order'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cycle Key:</span>
                  <span className="font-mono text-[11px] text-slate-600">{invoice.billingCycleKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax Applicability:</span>
                  <span className="font-medium text-slate-800">{invoice.taxRuleName || 'Standard GST 18%'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-3 font-semibold">Description</th>
                  <th className="py-3 text-center font-semibold">Qty</th>
                  <th className="py-3 text-right font-semibold">Unit Price</th>
                  <th className="py-3 text-right font-semibold">Discount</th>
                  <th className="py-3 text-right font-semibold">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-900">{item.description}</p>
                    </td>
                    <td className="py-3.5 text-center font-mono text-slate-700">{item.quantity}</td>
                    <td className="py-3.5 text-right font-mono text-slate-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3.5 text-right font-mono text-emerald-600">
                      {item.discountAmount > 0 ? `-${formatCurrency(item.discountAmount)}` : '—'}
                    </td>
                    <td className="py-3.5 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(item.amount - item.discountAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary and Financials */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-4 border-t border-slate-200">
            <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Payment Settlement Rails</span>
              </h4>
              <p className="text-slate-600 leading-relaxed mb-2">
                Payments must reference <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>.
              </p>
              <div className="space-y-1 font-mono text-slate-700 text-[11px]">
                <p>Bank: HDFC Bank Ltd, Indiranagar Branch</p>
                <p>Account Name: Brightloop Software Technologies Pvt Ltd</p>
                <p>Account No: 50200049281729 | IFSC: HDFC0000240</p>
                <p>Corporate UPI ID: brightloop@hdfcbank</p>
              </div>
            </div>

            <div className="w-full md:w-5/12 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 py-1">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 py-1">
                  <span>Discount ({invoice.discountRuleName || 'Applied'}):</span>
                  <span className="font-mono font-medium">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 py-1">
                <span>Tax ({invoice.taxRuleName || 'GST 18%'}):</span>
                <span className="font-mono font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-indigo-700">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs py-1">
                <span>Amount Paid:</span>
                <span className="font-mono font-medium text-emerald-600">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span className="text-slate-700">Balance Due:</span>
                <span className={`font-mono ${invoice.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatCurrency(invoice.outstandingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>Thank you for partnering with Subnexa by Brightloop Software.</p>
            <p className="mt-1">This is a computer-generated tax invoice that conforms to Rule 46 of the CGST Rules, 2017.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
