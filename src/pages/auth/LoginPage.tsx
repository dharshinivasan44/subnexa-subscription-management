import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Shield, Briefcase, User as UserIcon, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, switchUser, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  const handleDemoLogin = (userId: string) => {
    switchUser(userId);
    const user = users.find((u) => u.id === userId);
    if (user?.role === 'ADMIN') navigate('/admin/dashboard');
    else if (user?.role === 'STAFF') navigate('/staff/overview');
    else navigate('/portal/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUser(found.id);
      if (found.role === 'ADMIN') navigate('/admin/dashboard');
      else if (found.role === 'STAFF') navigate('/staff/overview');
      else navigate('/portal/dashboard');
    } else {
      addToast({
        type: 'error',
        title: 'User not found',
        message: 'Use one of the quick 1-click demo accounts below for instant evaluation.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subnexa</h1>
            <p className="text-xs text-slate-500 font-medium">Brightloop Software</p>
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-center text-xs text-slate-600">Smart Subscriptions. Seamless Revenue.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10 space-y-6">
          {/* Quick Demo Accounts Box */}
          <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                1-Click Demo Profiles
              </span>
              <span className="text-[11px] font-mono text-indigo-600">Hackathon Ready</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user-admin-1')}
                className="flex flex-col items-center p-3 rounded-lg bg-white border border-indigo-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer text-center group"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 flex items-center justify-center transition-colors mb-1.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Arvind Sharma</span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase mt-0.5">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('user-staff-1')}
                className="flex flex-col items-center p-3 rounded-lg bg-white border border-indigo-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer text-center group"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center transition-colors mb-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Priya Sundaram</span>
                <span className="text-[10px] text-blue-600 font-semibold uppercase mt-0.5">Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('user-customer-1')}
                className="flex flex-col items-center p-3 rounded-lg bg-white border border-indigo-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer text-center group"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center transition-colors mb-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Vikramaditya</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase mt-0.5">Customer</span>
              </button>
            </div>
          </div>

          {/* Standard Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  placeholder="e.g. arvind.sharma@brightloop.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden cursor-pointer transition-colors"
            >
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-600">
              New business customer?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register company account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
