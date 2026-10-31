import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscription, SubscriptionStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck2,
  Search,
  Filter,
  Play,
  Pause,
  XCircle,
  CheckCircle,
  Eye,
  Plus,
  X,
  FileSpreadsheet,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubscriptionsManagement: React.FC = () => {
  const {
    subscriptions,
    customers,
    plans,
    products,
    updateSubscriptionStatus,
    updateSubscription,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const filteredSubs = subscriptions.filter((sub) => {
    const cust = customers.find((c) => c.id === sub.customerId);
    const matchesSearch =
      sub.subscriptionNumber.toLowerCase().includes(search.toLowerCase()) ||
      (cust && cust.company.toLowerCase().includes(search.toLowerCase())) ||
      (cust && cust.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusTransition = (sub: Subscription, newStatus: SubscriptionStatus) => {
    updateSubscriptionStatus(sub.id, newStatus);
    if (selectedSub && selectedSub.id === sub.id) {
      setSelectedSub({ ...selectedSub, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Subscription Lifecycle Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Governs end-to-end subscriber lifecycles: Draft → Quotation → Confirmed → Active → Closed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/staff/quotations"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Quotation</span>
          </Link>
        </div>
      </div>

      {/* Lifecycle Flow Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
          Subnexa Governed State Machine
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">1. Draft</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-200">
            2. Quotation
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
            3. Confirmed
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
            4. Active (Billing Active)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-200">
            5. Closed / Paused
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscription #, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses ({subscriptions.length})</option>
            <option value="ACTIVE">Active</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PAUSED">Paused</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Subscription</th>
              <th className="py-3 px-4">Customer & Plan</th>
              <th className="py-3 px-4">Lifecycle Status</th>
              <th className="py-3 px-4">Terms</th>
              <th className="py-3 px-4">Next Billing Date</th>
              <th className="py-3 px-4 text-right">Periodic Total</th>
              <th className="py-3 px-4 text-right">Lifecycle Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSubs.map((sub) => {
              const cust = customers.find((c) => c.id === sub.customerId);
              const plan = plans.find((p) => p.id === sub.planId);
              return (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-indigo-700">{sub.subscriptionNumber}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Started {formatDate(sub.startDate)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{cust?.company || 'Enterprise Customer'}</p>
                    <p className="text-[11px] text-slate-500">{plan?.name || 'Custom Enterprise Plan'}</p>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={sub.status} />
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {sub.paymentTerms}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{formatDate(sub.nextBillingDate)}</span>
                      {new Date(sub.nextBillingDate) <= new Date() && sub.status === 'ACTIVE' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Due for billing run" />
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(sub.totalAmount)}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      /{sub.billingInterval.toLowerCase()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {sub.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusTransition(sub, 'ACTIVE')}
                          className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                        >
                          Activate
                        </button>
                      )}

                      {sub.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleStatusTransition(sub, 'PAUSED')}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md hover:bg-amber-50 cursor-pointer"
                            title="Pause Subscription"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusTransition(sub, 'CLOSED')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                            title="Close Subscription"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {sub.status === 'PAUSED' && (
                        <button
                          onClick={() => handleStatusTransition(sub, 'ACTIVE')}
                          className="px-2 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors cursor-pointer"
                        >
                          Resume
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

      {/* Subscription Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div>
                <h3 className="font-semibold text-sm">Subscription Details</h3>
                <p className="text-[11px] font-mono text-slate-400">{selectedSub.subscriptionNumber}</p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Lifecycle State</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedSub.status} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Periodic Charge</span>
                  <p className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(selectedSub.totalAmount)} / {selectedSub.billingInterval.toLowerCase()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Line Items</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedSub.items.map((item, i) => {
                        const prod = products.find((p) => p.id === item.productId);
                        return (
                          <tr key={i}>
                            <td className="p-2 font-medium">{prod?.name || 'Software License'}</td>
                            <td className="p-2 text-center font-mono">{item.quantity}</td>
                            <td className="p-2 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                            <td className="p-2 text-right font-mono font-semibold">{formatCurrency(item.total)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase block">Start Date</span>
                  <span className="font-mono font-semibold text-slate-800">{formatDate(selectedSub.startDate)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase block">Next Billing Cycle</span>
                  <span className="font-mono font-semibold text-indigo-700">{formatDate(selectedSub.nextBillingDate)}</span>
                </div>
              </div>

              {selectedSub.notes && (
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-slate-700">
                  <span className="font-bold text-indigo-900 block mb-0.5">Subscription Notes</span>
                  <p className="leading-relaxed">{selectedSub.notes}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-400 text-[10px] font-mono">ID: {selectedSub.id}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
