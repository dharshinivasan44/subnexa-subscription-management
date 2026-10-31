import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaxRule, DiscountRule } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Percent,
  Tag,
  Plus,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export const TaxDiscountManagement: React.FC = () => {
  const {
    taxRules,
    discountRules,
    products,
    addTaxRule,
    updateTaxRule,
    addDiscountRule,
    updateDiscountRule,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'TAX' | 'DISCOUNT'>('TAX');

  // Tax Modal state
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [taxName, setTaxName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(18);
  const [taxApplicability, setTaxApplicability] = useState<TaxRule['applicability']>('DOMESTIC');

  // Discount Modal state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discName, setDiscName] = useState('');
  const [discCode, setDiscCode] = useState('');
  const [discType, setDiscType] = useState<DiscountRule['type']>('PERCENTAGE');
  const [discValue, setDiscValue] = useState(15);
  const [minPurchase, setMinPurchase] = useState(2000);
  const [usageLimit, setUsageLimit] = useState(100);
  const [scope, setScope] = useState<DiscountRule['scope']>('SUBSCRIPTION_WIDE');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCreateTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxName) return;

    addTaxRule({
      name: taxName,
      code: taxCode || `TAX-${taxPercentage}`,
      percentage: Number(taxPercentage),
      applicability: taxApplicability,
      active: true,
      description: `${taxApplicability} fiscal rule`,
    });

    setIsTaxModalOpen(false);
    setTaxName('');
    setTaxCode('');
    setTaxPercentage(18);
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discName || !discCode) return;

    addDiscountRule({
      name: discName,
      code: discCode.toUpperCase().trim(),
      type: discType,
      value: Number(discValue),
      minPurchaseAmount: Number(minPurchase),
      startDate,
      expiryDate,
      usageLimit: Number(usageLimit),
      scope,
      applicableProductIds: scope === 'PRODUCT_SPECIFIC' ? [selectedProductId] : undefined,
      active: true,
    });

    setIsDiscountModalOpen(false);
    setDiscName('');
    setDiscCode('');
    setDiscValue(15);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Tax & Discount Policy Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Indian GST/IGST compliance rules, promo credits, volume discounts, and automatic billing deductions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'TAX' ? (
            <button
              onClick={() => setIsTaxModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tax Rule</span>
            </button>
          ) : (
            <button
              onClick={() => setIsDiscountModalOpen(true)}
              disabled={currentUser.role !== 'ADMIN'}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Discount Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('TAX')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'TAX'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Tax Rates & GST Compliance ({taxRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DISCOUNT')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'DISCOUNT'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promotions & Coupon Discounts ({discountRules.length})</span>
        </button>
      </div>

      {/* TAB 1: TAX RULES */}
      {activeTab === 'TAX' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {taxRules.map((tax) => (
              <div
                key={tax.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {tax.code}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        tax.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tax.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-3">{tax.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-indigo-700">{tax.percentage}%</span>
                    <span className="text-xs text-slate-400">rate</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {tax.description || 'Statutory tax deduction computed at billing generation.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scope:</span>
                  <span className="font-semibold text-slate-700 uppercase">{tax.applicability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DISCOUNT RULES */}
      {activeTab === 'DISCOUNT' && (
        <div className="space-y-4">
          {currentUser.role !== 'ADMIN' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Notice: Only users with ADMIN role can create or modify commercial discount rules.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {discountRules.map((disc) => (
              <div
                key={disc.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      {disc.code}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        disc.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {disc.active ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3">{disc.name}</h3>

                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-emerald-700">
                      {disc.type === 'PERCENTAGE' ? `${disc.value}% OFF` : `-${formatCurrency(disc.value)}`}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min Purchase:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {disc.minPurchaseAmount ? formatCurrency(disc.minPurchaseAmount) : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Usage Limit:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {disc.usedCount} / {disc.usageLimit || '∞'} used
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Applicability:</span>
                      <span className="font-medium text-slate-800">
                        {disc.scope === 'PRODUCT_SPECIFIC' ? 'Product Specific' : 'Subscription-Wide'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Through:</span>
                      <span className="font-mono text-slate-800">{formatDate(disc.expiryDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Started {formatDate(disc.startDate)}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">Auto-applied at billing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Tax Modal */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-sm">Create Tax Rule</h3>
              <button onClick={() => setIsTaxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTax} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tax Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GST 18% (Intra-State)"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax Code</label>
                  <input
                    type="text"
                    placeholder="GST-18"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Percentage Rate (%) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicability</label>
                <select
                  value={taxApplicability}
                  onChange={(e) => setTaxApplicability(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DOMESTIC">DOMESTIC (Standard Indian Intra-State)</option>
                  <option value="INTERSTATE">INTERSTATE (IGST Across States)</option>
                  <option value="EXPORT">EXPORT (Zero-Rated / Foreign Supply)</option>
                  <option value="ALL">ALL (Universal Rate)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaxModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Save Tax Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-sm">Create Commercial Discount Policy</h3>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDiscount} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Policy / Promotion Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Growth Rebate"
                    value={discName}
                    onChange={(e) => setDiscName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coupon / Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="GROWTH20"
                    value={discCode}
                    onChange={(e) => setDiscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discType}
                    onChange={(e) => setDiscType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (₹ INR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Value {discType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discValue}
                    onChange={(e) => setDiscValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Purchase (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SUBSCRIPTION_WIDE">Subscription-Wide</option>
                    <option value="PRODUCT_SPECIFIC">Product-Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {scope === 'PRODUCT_SPECIFIC' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applicable Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Create Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
