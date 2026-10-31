import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  Plus,
  Eye,
  Building2,
  Phone,
  Mail,
  Calendar,
  X,
  CreditCard,
  Receipt,
  Repeat,
  MapPin,
} from 'lucide-react';

export const StaffCustomers: React.FC = () => {
  const { customers, subscriptions, invoices, payments, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Customer Profile Drawer / Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    addCustomer({
      name,
      company,
      email,
      phone,
      gstin,
      address,
      city,
      state,
      pincode: '400001',
      status: 'ACTIVE',
      notes,
    });

    setIsAddModalOpen(false);
    setName('');
    setCompany('');
    setEmail('');
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Enterprise Customer Accounts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage subscriber companies, registered GST profiles, and view complete subscription and billing ledgers.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Customer</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, company, GSTIN..."
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
            <option value="ALL">All Statuses ({customers.length})</option>
            <option value="ACTIVE">Active</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Customer & Company</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4 text-center">Subscriptions</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((cust) => {
              const custSubs = subscriptions.filter((s) => s.customerId === cust.id);
              return (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-sm">{cust.company}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Contact: {cust.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-700">{cust.email}</p>
                    <p className="text-[11px] font-mono text-slate-500">{cust.phone}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{formatDate(cust.registeredDate)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 font-mono font-bold text-indigo-700 border border-indigo-200">
                      {custSubs.length} active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={cust.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      View 360° Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer 360° Profile Drawer / Modal (Section 10) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-base">{selectedCustomer.company}</h3>
                <p className="text-xs text-slate-400 font-mono">Customer ID: {selectedCustomer.id}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Contact</span>
                  <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedCustomer.name}</p>
                  <p className="text-slate-600 mt-1">{selectedCustomer.email}</p>
                  <p className="text-slate-600 font-mono">{selectedCustomer.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tax & Compliance</span>
                  <p className="font-mono text-slate-800 font-bold mt-1">
                    GSTIN: {selectedCustomer.gstin || 'Unregistered'}
                  </p>
                  <p className="text-slate-500 mt-1">Joined: {formatDate(selectedCustomer.registeredDate)}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Location</span>
                  <p className="text-slate-700 mt-1">{selectedCustomer.address}</p>
                  <p className="text-slate-700">
                    {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}
                  </p>
                </div>
              </div>

              {/* Connected Subscriptions */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <Repeat className="w-4 h-4 text-indigo-600" />
                  <span>Subscribed Products & Contracts</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">Sub #</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Billing Cadence</th>
                        <th className="p-2.5">Next Billing</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscriptions
                        .filter((s) => s.customerId === selectedCustomer.id)
                        .map((s) => (
                          <tr key={s.id}>
                            <td className="p-2.5 font-mono font-bold text-indigo-700">{s.subscriptionNumber}</td>
                            <td className="p-2.5">
                              <StatusBadge status={s.status} size="sm" />
                            </td>
                            <td className="p-2.5 font-mono">{s.billingInterval}</td>
                            <td className="p-2.5 font-mono">{formatDate(s.nextBillingDate)}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              {formatCurrency(s.totalAmount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoices History */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Invoice Ledger</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">Invoice #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Total</th>
                        <th className="p-2.5 text-right">Balance Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices
                        .filter((i) => i.customerId === selectedCustomer.id)
                        .map((inv) => (
                          <tr key={inv.id}>
                            <td className="p-2.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                            <td className="p-2.5 font-mono">{formatDate(inv.invoiceDate)}</td>
                            <td className="p-2.5">
                              <StatusBadge status={inv.status} size="sm" />
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold">
                              {formatCurrency(inv.totalAmount)}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold">
                              <span className={inv.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                                {formatCurrency(inv.outstandingAmount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payments History */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Settled Payments Record</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">Receipt #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">UTR / Ref</th>
                        <th className="p-2.5 text-right">Settled Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments
                        .filter((p) => p.customerId === selectedCustomer.id)
                        .map((p) => (
                          <tr key={p.id}>
                            <td className="p-2.5 font-mono font-bold text-slate-900">{p.paymentNumber}</td>
                            <td className="p-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                            <td className="p-2.5 font-semibold text-slate-700">{p.paymentMethod}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-500">{p.referenceNumber}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-emerald-600">
                              {formatCurrency(p.amount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-semibold text-sm">Onboard Enterprise Client</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Fintech Ltd"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="suresh@apexfin.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="27AAACA1234F1Z8"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
