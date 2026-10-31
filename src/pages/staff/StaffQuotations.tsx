import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationLineItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  Eye,
  FileCheck,
  Send,
  X,
  Layers,
  Percent,
  Tag,
  Building2,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StaffQuotations: React.FC = () => {
  const {
    quotations,
    customers,
    products,
    plans,
    taxRules,
    discountRules,
    createQuotation,
    updateQuotationStatus,
    convertQuotationToSubscription,
    currentUser,
    addToast,
  } = useApp();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  // New Quotation Form
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [templateName, setTemplateName] = useState('Standard Enterprise SaaS Quotation');
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Includes introductory deployment support.');
  const [terms, setTerms] = useState(
    'Payment due within 15 days of invoice date. Prices valid for 30 days.'
  );

  // Line item selector
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  // Line items list
  const [items, setItems] = useState<QuotationLineItem[]>([
    {
      id: 'qli-init',
      productId: products[0]?.id || '',
      variantId: products[0]?.variants[1]?.id || '',
      planId: plans[0]?.id || '',
      description: 'Brightloop Cloud ERP - Odoo Variant Adjustment (Qty: 2)',
      quantity: 2,
      unitPrice: 2560,
      discountAmount: 0,
      taxAmount: 0,
      total: 5120,
    },
  ]);

  const [selectedTaxRuleId, setSelectedTaxRuleId] = useState(taxRules[0]?.id || '');
  const [selectedDiscountRuleId, setSelectedDiscountRuleId] = useState(discountRules[0]?.id || '');

  // Dynamic calculations
  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const activeTaxRule = taxRules.find((t) => t.id === selectedTaxRuleId);
  const taxRate = activeTaxRule ? activeTaxRule.percentage : 18;

  const activeDiscountRule = discountRules.find((d) => d.id === selectedDiscountRuleId);
  let totalDiscount = 0;
  if (activeDiscountRule && subtotal >= (activeDiscountRule.minPurchaseAmount || 0)) {
    if (activeDiscountRule.type === 'PERCENTAGE') {
      totalDiscount = (subtotal * activeDiscountRule.value) / 100;
    } else {
      totalDiscount = activeDiscountRule.value;
    }
  }

  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const totalTax = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + totalTax;

  const handleAddItem = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    const variant = prod?.variants.find((v) => v.id === selectedVariantId);
    const plan = plans.find((p) => p.id === selectedPlanId);

    const unitPrice = (prod?.salesPrice || 2000) + (variant?.priceAdjustment || 0);
    const desc = `${prod?.name || 'Software'}${variant ? ` - ${variant.name}` : ''}`;

    const newItem: QuotationLineItem = {
      id: `qli-${Date.now()}`,
      productId: selectedProductId,
      variantId: selectedVariantId || undefined,
      planId: selectedPlanId,
      description: desc,
      quantity,
      unitPrice,
      discountAmount: 0,
      taxAmount: 0,
      total: unitPrice * quantity,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    createQuotation({
      customerId: selectedCustomerId,
      createdByStaffId: currentUser.id,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil,
      templateName,
      notes,
      terms,
      items,
      subtotal,
      taxRuleId: selectedTaxRuleId,
      taxRate,
      totalTax,
      discountRuleId: selectedDiscountRuleId || undefined,
      totalDiscount,
      grandTotal,
    });

    setIsCreateModalOpen(false);
  };

  const handleConvertToSubscription = (quotationId: string) => {
    try {
      const sub = convertQuotationToSubscription(quotationId);
      // Navigate to subscriptions management so user can see it confirmed/activate it!
      navigate('/admin/subscriptions');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuotes = quotations.filter((q) => {
    const cust = customers.find((c) => c.id === q.customerId);
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (cust && cust.company.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Commercial Quotations Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create multi-line software and service proposals, compute automated taxes and discounts, and convert to active subscriptions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation Proposal</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search quotation #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses ({quotations.length})</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONVERTED">Converted to Sub</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Quote Ref</th>
              <th className="py-3 px-4">Customer Company</th>
              <th className="py-3 px-4">Template Scope</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Valid Until</th>
              <th className="py-3 px-4 text-right">Grand Total (Incl. Tax)</th>
              <th className="py-3 px-4 text-right">Workflow Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQuotes.map((q) => {
              const cust = customers.find((c) => c.id === q.customerId);
              return (
                <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{q.quotationNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{cust?.company || 'Prospective Client'}</p>
                    <p className="text-[11px] text-slate-500">{cust?.name}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{q.templateName}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{formatDate(q.validUntil)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(q.grandTotal)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedQuotation(q)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 cursor-pointer"
                        title="View Quotation Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {q.status === 'SENT' && (
                        <button
                          onClick={() => updateQuotationStatus(q.id, 'ACCEPTED')}
                          className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors cursor-pointer"
                        >
                          Mark Accepted
                        </button>
                      )}

                      {q.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleConvertToSubscription(q.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Convert to Sub</span>
                        </button>
                      )}

                      {q.status === 'CONVERTED' && (
                        <span className="text-[11px] font-mono text-emerald-600 font-medium">Converted</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Quotation Modal (Section 11) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-sm">Create Commercial Proposal Quotation</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Customer *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quotation Template</label>
                  <select
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Standard Enterprise SaaS Quotation">Standard Enterprise SaaS Quotation</option>
                    <option value="Multi-Year Cloud License Agreement">Multi-Year Cloud License Agreement</option>
                    <option value="FinTech High-Throughput Cluster Contract">FinTech High-Throughput Cluster Contract</option>
                    <option value="Startup Accelerator Tier Agreement">Startup Accelerator Tier Agreement</option>
                  </select>
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Quotation Line Items ({items.length})
                  </span>
                </div>

                {/* Existing Items Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2">Description</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Rate</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-medium text-slate-900">{it.description}</td>
                          <td className="p-2 text-center font-mono">{it.quantity}</td>
                          <td className="p-2 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                          <td className="p-2 text-right font-mono font-bold">{formatCurrency(it.quantity * it.unitPrice)}</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Item Row */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Product</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        setSelectedVariantId('');
                      }}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Variant Adjustment</label>
                    <select
                      value={selectedVariantId}
                      onChange={(e) => setSelectedVariantId(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    >
                      <option value="">Default (None)</option>
                      {products
                        .find((p) => p.id === selectedProductId)
                        ?.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} (+{formatCurrency(v.priceAdjustment)})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Plan / Cadence</label>
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    >
                      {plans.map((pl) => (
                        <option key={pl.id} value={pl.id}>
                          {pl.name} ({pl.billingInterval})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-16">
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded text-xs cursor-pointer"
                    >
                      Add Line
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax & Discount Engine Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax Applicability Rule</label>
                  <select
                    value={selectedTaxRuleId}
                    onChange={(e) => setSelectedTaxRuleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden"
                  >
                    {taxRules.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.percentage}%) - {t.applicability}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eligible Promo / Discount Rule</label>
                  <select
                    value={selectedDiscountRuleId}
                    onChange={(e) => setSelectedDiscountRuleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden"
                  >
                    <option value="">None (Standard Rate)</option>
                    {discountRules.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name} ({d.value}
                        {d.type === 'PERCENTAGE' ? '%' : ' INR'} off)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Calculation Summary Strip */}
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-600">
                    Gross Subtotal: <span className="font-mono font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                  </p>
                  {totalDiscount > 0 && (
                    <p className="text-emerald-700">
                      Auto Discount ({activeDiscountRule?.code}):{' '}
                      <span className="font-mono font-bold">-{formatCurrency(totalDiscount)}</span>
                    </p>
                  )}
                  <p className="text-slate-600">
                    Tax ({activeTaxRule?.code} @ {taxRate}%):{' '}
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(totalTax)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Quotation Grand Total</span>
                  <span className="text-2xl font-black font-mono text-indigo-700">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Terms & Conditions</label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Generate Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Quotation Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div>
                <h3 className="font-semibold text-sm">Quotation Proposal</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedQuotation.quotationNumber}</p>
              </div>
              <button onClick={() => setSelectedQuotation(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedQuotation.status} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Grand Total</span>
                  <p className="font-mono font-bold text-indigo-700 text-base">{formatCurrency(selectedQuotation.grandTotal)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Item Breakdown</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedQuotation.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-medium">{it.description}</td>
                          <td className="p-2.5 text-center font-mono">{it.quantity}</td>
                          <td className="p-2.5 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                          <td className="p-2.5 text-right font-mono font-bold">{formatCurrency(it.quantity * it.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                {selectedQuotation.status === 'ACCEPTED' ? (
                  <button
                    onClick={() => {
                      handleConvertToSubscription(selectedQuotation.id);
                      setSelectedQuotation(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Convert to Active Subscription</span>
                  </button>
                ) : (
                  <span className="text-slate-500 text-[11px]">Valid until {formatDate(selectedQuotation.validUntil)}</span>
                )}

                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
