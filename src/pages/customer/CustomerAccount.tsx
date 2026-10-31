import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const { currentUser, customers, payments } = useApp();

  const customerId = currentUser.customerId || 'cust-1';
  const customer = customers.find((c) => c.id === customerId);
  const myPayments = payments.filter((p) => p.customerId === customerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Account Profile & Settlement History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Corporate entity registration, GST tax credentials, and historical payment transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">{customer?.company}</h2>
              <p className="text-xs text-slate-500">Corporate Subscriber</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Contact Person</span>
              <p className="font-medium text-slate-800 text-sm mt-0.5">{customer?.name}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Business Email</span>
              <p className="font-medium text-slate-800 mt-0.5">{customer?.email}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Phone</span>
              <p className="font-mono font-medium text-slate-800 mt-0.5">{customer?.phone}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">GSTIN Registration</span>
              <p className="font-mono font-bold text-indigo-700 text-sm mt-0.5">{customer?.gstin || '27AAACZ1234D1Z5'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registered Address</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {customer?.address}, {customer?.city}, {customer?.state} - {customer?.pincode}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>KYC Verified & GST Active</span>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Payment Transactions Ledger</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{myPayments.length} Payments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Receipt Ref</th>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Bank UTR / Ref</th>
                    <th className="py-3 px-4 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    myPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{p.paymentNumber}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">{p.invoiceNumber}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{formatDate(p.paymentDate)}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{p.paymentMethod}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{p.referenceNumber}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                          {formatCurrency(p.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
            For payment inquiries or remittance slips, write to <span className="font-semibold text-slate-700">billing@brightloop.io</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
