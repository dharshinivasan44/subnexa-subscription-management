import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck2,
  Repeat,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const CustomerSubscriptions: React.FC = () => {
  const { currentUser, subscriptions, plans, products, updateSubscriptionStatus, addToast } = useApp();

  const customerId = currentUser.customerId || 'cust-1';
  const mySubs = subscriptions.filter((s) => s.customerId === customerId);

  const handlePause = (subId: string) => {
    updateSubscriptionStatus(subId, 'PAUSED');
    addToast({
      type: 'info',
      title: 'Subscription Paused',
      message: 'Your subscription recurring billing cycle is temporarily paused.',
    });
  };

  const handleResume = (subId: string) => {
    updateSubscriptionStatus(subId, 'ACTIVE');
    addToast({
      type: 'success',
      title: 'Subscription Resumed',
      message: 'Your subscription recurring billing cycle is active.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">My Subscriptions & Licenses</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View active contracts, scheduled renewal dates, product line entitlements, and lifecycle control.
        </p>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mySubs.map((sub) => {
          const plan = plans.find((p) => p.id === sub.planId);
          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-700 block">
                      {sub.subscriptionNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">
                      {plan?.name || 'Enterprise Cloud Suite'}
                    </h3>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {formatCurrency(sub.totalAmount)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/{sub.billingInterval.toLowerCase()}</span>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Product Lines & Entitlements
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    {sub.items.map((it, idx) => {
                      const prod = products.find((p) => p.id === it.productId);
                      return (
                        <div key={idx} className="flex justify-between items-center text-slate-700">
                          <span className="font-medium truncate pr-2">
                            {prod?.name || 'Software Subscription'} (Qty: {it.quantity})
                          </span>
                          <span className="font-mono font-semibold shrink-0">{formatCurrency(it.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dates */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Start Date</span>
                    <span className="font-mono font-medium text-slate-800">{formatDate(sub.startDate)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Next Billing Cycle</span>
                    <span className="font-mono font-bold text-indigo-700">{formatDate(sub.nextBillingDate)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">Terms: {sub.paymentTerms}</span>
                <div>
                  {sub.status === 'ACTIVE' && plan?.allowPause && (
                    <button
                      onClick={() => handlePause(sub.id)}
                      className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                    >
                      Pause Subscription
                    </button>
                  )}
                  {sub.status === 'PAUSED' && (
                    <button
                      onClick={() => handleResume(sub.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Resume Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
