import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { addCustomer, addToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    gstin: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email) return;

    addCustomer({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone || '+91 98000 00000',
      gstin: formData.gstin || '27AAACB0000A1Z5',
      address: formData.address || 'Business Park',
      city: formData.city || 'Mumbai',
      state: formData.state,
      pincode: formData.pincode || '400001',
      status: 'ONBOARDING',
      notes: formData.notes,
    });

    addToast({
      type: 'success',
      title: 'Registration Successful',
      message: 'Your company profile is registered. Welcome to Subnexa!',
    });

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Subnexa</h1>
            <p className="text-xs text-slate-500 font-medium">Customer Onboarding Portal</p>
          </div>
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-900">Register Enterprise Account</h2>
        <p className="mt-1 text-xs text-slate-600">Start managing your Brightloop subscriptions and licenses.</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Fintech Labs"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alok@apexlabs.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98200 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">GSTIN (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 27AAACA1234F1Z8"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Registered Address</label>
              <textarea
                rows={2}
                placeholder="Office suite, building, street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden cursor-pointer transition-colors"
            >
              <span>Submit Registration</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
