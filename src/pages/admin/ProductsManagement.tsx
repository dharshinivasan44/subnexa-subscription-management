import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariant } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  IndianRupee,
  Layers,
  X,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';

export const ProductsManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New product form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [type, setType] = useState<Product['type']>('SOFTWARE_LICENSE');
  const [salesPrice, setSalesPrice] = useState<number>(2000); // Default base price ₹2,000 as per example
  const [costPrice, setCostPrice] = useState<number>(800);
  const [notes, setNotes] = useState('');

  // Variants in modal
  const [variants, setVariants] = useState<Array<{ name: string; sku: string; priceAdjustment: number }>>([
    { name: 'Standard Edition', sku: '-STD', priceAdjustment: 0 },
    { name: 'Odoo Variant Adjustment', sku: '-ODOO', priceAdjustment: 560 }, // Example from prompt!
  ]);

  const [newVarName, setNewVarName] = useState('');
  const [newVarAdjustment, setNewVarAdjustment] = useState<number>(0);

  const handleAddVariantLine = () => {
    if (!newVarName) return;
    setVariants((prev) => [
      ...prev,
      {
        name: newVarName,
        sku: `-VAR-${prev.length + 1}`,
        priceAdjustment: Number(newVarAdjustment),
      },
    ]);
    setNewVarName('');
    setNewVarAdjustment(0);
  };

  const handleRemoveVariantLine = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || salesPrice <= 0) return;

    const formattedVariants: ProductVariant[] = variants.map((v, i) => ({
      id: `var-${Date.now()}-${i}`,
      name: v.name,
      sku: `${sku || 'SKU'}${v.sku}`,
      priceAdjustment: Number(v.priceAdjustment),
    }));

    addProduct({
      name,
      sku: sku || `BL-PROD-${Date.now().toString().slice(-4)}`,
      type,
      salesPrice: Number(salesPrice),
      costPrice: Number(costPrice),
      notes,
      active: true,
      variants: formattedVariants,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setSalesPrice(2000);
    setCostPrice(800);
    setNotes('');
    setVariants([
      { name: 'Standard Edition', sku: '-STD', priceAdjustment: 0 },
      { name: 'Odoo Variant Adjustment', sku: '-ODOO', priceAdjustment: 560 },
    ]);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Products & SKU Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subscription software products, infrastructure licenses, and dynamic variant pricing rules.
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
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Types</option>
            <option value="SOFTWARE_LICENSE">Software License</option>
            <option value="SERVICE">Service</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
          </select>
        </div>
      </div>

      {/* Products Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{prod.name}</h3>
                    <span className="font-mono text-[11px] text-slate-400">{prod.sku}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {prod.type.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {prod.notes || 'No extended notes entered.'}
              </p>

              {/* Pricing breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Base Price</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(prod.salesPrice)}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cost Price</span>
                  <span className="font-mono text-slate-600 text-sm">{formatCurrency(prod.costPrice)}</span>
                </div>
              </div>

              {/* Variants Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Variants ({prod.variants.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Dynamic Adjustments</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {prod.variants.map((v) => {
                    const finalPrice = prod.salesPrice + v.priceAdjustment;
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-100"
                      >
                        <div className="truncate pr-2">
                          <p className="font-medium text-slate-800 truncate">{v.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {v.priceAdjustment >= 0 ? `+${formatCurrency(v.priceAdjustment)}` : formatCurrency(v.priceAdjustment)} adj
                          </p>
                        </div>
                        <span className="font-mono font-bold text-indigo-700 shrink-0">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Created {formatDate(prod.createdAt)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteProduct(prod.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal with Dynamic Variant Pricing Calculator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-sm">Add Product & Configure Variants</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brightloop Cloud ERP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BL-ERP-100"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SOFTWARE_LICENSE">Software License</option>
                    <option value="SERVICE">Service</option>
                    <option value="INFRASTRUCTURE">Infrastructure</option>
                    <option value="SUPPORT_PLAN">Support Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Sales Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enterprise feature scope, SLA commitments, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Dynamic Variant Pricing Example Box as instructed in Section 7 */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Configured Variants & Live Pricing Preview</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Calculation
                  </span>
                </div>

                {/* Live Variant Calculator Banner */}
                <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-100 mb-3 space-y-1">
                  <p className="font-semibold text-indigo-950 text-[11px]">
                    Dynamic Pricing Formula: Base Price ({formatCurrency(salesPrice)}) + Variant Adjustment = Final Total
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Example: Base ₹2,000 + Odoo Adjustment ₹560 = <span className="font-mono font-bold text-indigo-700">₹2,560</span>
                  </p>
                </div>

                {/* Existing Variants List */}
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {variants.map((v, idx) => {
                    const finalTotal = salesPrice + v.priceAdjustment;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{v.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">
                            Adjustment: {v.priceAdjustment >= 0 ? `+${formatCurrency(v.priceAdjustment)}` : formatCurrency(v.priceAdjustment)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Final Price</span>
                            <span className="font-mono font-bold text-indigo-700 text-xs">
                              {formatCurrency(finalTotal)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantLine(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Variant Form */}
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                  <input
                    type="text"
                    placeholder="Variant name (e.g. Odoo Bridge)"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-md bg-white outline-hidden"
                  />
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Adj (₹)"
                      value={newVarAdjustment || ''}
                      onChange={(e) => setNewVarAdjustment(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white font-mono outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantLine}
                    className="px-3 py-1.5 font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-md transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
