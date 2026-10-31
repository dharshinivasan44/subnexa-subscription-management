import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, BillingInterval } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Layers,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  PauseCircle,
  PlayCircle,
  X,
  AlertCircle,
} from 'lucide-react';

export const PlansManagement: React.FC = () => {
  const { plans, products, addPlan, updatePlan, deletePlan, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [intervalFilter, setIntervalFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Plan form state
  const [name, setName] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('MONTHLY');
  const [price, setPrice] = useState<number>(2560);
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [availabilityStartDate, setAvailabilityStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [availabilityEndDate, setAvailabilityEndDate] = useState('');
  const [allowPause, setAllowPause] = useState(true);
  const [trialDays, setTrialDays] = useState(14);
  const [autoCloseAfterCycles, setAutoCloseAfterCycles] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    addPlan({
      name,
      productId,
      billingInterval,
      intervalCount: 1,
      price: Number(price),
      currency: 'INR',
      minQuantity: Number(minQuantity),
      availabilityStartDate,
      availabilityEndDate: availabilityEndDate || undefined,
      allowPause,
      trialDays: Number(trialDays),
      autoCloseAfterCycles: autoCloseAfterCycles ? Number(autoCloseAfterCycles) : undefined,
      active: true,
      description,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setProductId(products[0]?.id || '');
    setBillingInterval('MONTHLY');
    setPrice(2560);
    setMinQuantity(1);
    setAllowPause(true);
    setTrialDays(14);
    setDescription('');
  };

  const handleTogglePlanActive = (plan: SubscriptionPlan) => {
    updatePlan(plan.id, { active: !plan.active });
    addToast({
      type: 'info',
      title: plan.active ? 'Plan Deactivated' : 'Plan Activated',
      message: `${plan.name} is now ${plan.active ? 'hidden from new signups' : 'active and available'}.`,
    });
  };

  const filteredPlans = plans.filter((pl) => {
    const matchesSearch = pl.name.toLowerCase().includes(search.toLowerCase());
    const matchesInterval = intervalFilter === 'ALL' || pl.billingInterval === intervalFilter;
    return matchesSearch && matchesInterval;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Subscription Plans & Cadence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure daily, weekly, monthly and annual recurring schedules, lifecycle rules and pause policies.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Subscription Plan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plans by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Billing Interval:</span>
          <select
            value={intervalFilter}
            onChange={(e) => setIntervalFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Cadences</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlans.map((plan) => {
          const linkedProduct = products.find((p) => p.id === plan.productId);
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                plan.active ? 'border-slate-200' : 'border-slate-200 opacity-70 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 tracking-wider">
                      {linkedProduct?.name || 'Base Software'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{plan.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      plan.billingInterval === 'YEARLY'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {plan.billingInterval}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.billingInterval.toLowerCase()}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {plan.description || 'Enterprise recurring plan with automated renewals and ledger generation.'}
                </p>

                {/* Plan rules */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Quantity:</span>
                    <span className="font-mono font-medium text-slate-700">{plan.minQuantity} seat(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trial Period:</span>
                    <span className="font-mono font-medium text-slate-700">{plan.trialDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pause Allowed:</span>
                    <span className="font-medium text-slate-700">{plan.allowPause ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Effective Date:</span>
                    <span className="font-mono text-slate-700">{formatDate(plan.availabilityStartDate)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePlanActive(plan)}
                  className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    plan.active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {plan.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{plan.active ? 'Active' : 'Inactive'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plan Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-sm">Configure Subscription Plan</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud ERP Monthly Scale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Billing Interval</label>
                  <select
                    value={billingInterval}
                    onChange={(e) => setBillingInterval(e.target.value as BillingInterval)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recurring Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability Start Date</label>
                  <input
                    type="date"
                    required
                    value={availabilityStartDate}
                    onChange={(e) => setAvailabilityStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trial Days</label>
                  <input
                    type="number"
                    min="0"
                    value={trialDays}
                    onChange={(e) => setTrialDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="allowPause"
                  checked={allowPause}
                  onChange={(e) => setAllowPause(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allowPause" className="text-slate-700 font-medium">
                  Allow customers to pause subscription cycle
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Description</label>
                <textarea
                  rows={2}
                  placeholder="Included feature entitlements, compute quotas, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
