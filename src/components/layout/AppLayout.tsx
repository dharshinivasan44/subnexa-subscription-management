import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Percent,
  CalendarCheck2,
  Receipt,
  FileSpreadsheet,
  FileText,
  UserCheck,
  CreditCard,
  PieChart,
  TrendingUp,
  AlertOctagon,
  LogOut,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Building2,
  Menu,
  X,
  Shield,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentUser, switchUser, setUserRole, users, resetToDemoData } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Grouped Navigation Items per Role
  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Products & Variants', path: '/admin/products', icon: Package },
    { label: 'Subscription Plans', path: '/admin/plans', icon: Layers },
    { label: 'Taxes & Discounts', path: '/admin/taxes-discounts', icon: Percent },
    { label: 'Subscription Lifecycle', path: '/admin/subscriptions', icon: CalendarCheck2 },
    { label: 'Recurring Billing Center', path: '/admin/billing', icon: Receipt },
  ];

  const staffNav = [
    { label: 'Staff Overview', path: '/staff/overview', icon: LayoutDashboard },
    { label: 'Customer Management', path: '/staff/customers', icon: UserCheck },
    { label: 'Quotations Management', path: '/staff/quotations', icon: FileSpreadsheet },
    { label: 'Subscription & Billing Ops', path: '/staff/operations', icon: CalendarCheck2 },
  ];

  const customerNav = [
    { label: 'Customer Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'My Subscriptions', path: '/portal/subscriptions', icon: CalendarCheck2 },
    { label: 'My Invoices', path: '/portal/invoices', icon: Receipt },
    { label: 'Payments & Account', path: '/portal/account', icon: CreditCard },
  ];

  const financeNav = [
    { label: 'Finance Overview', path: '/finance/overview', icon: PieChart },
    { label: 'Revenue Analytics', path: '/finance/analytics', icon: TrendingUp },
    { label: 'Receivables & Overdue', path: '/finance/receivables', icon: AlertOctagon },
  ];

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setRoleDropdownOpen(false);
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'STAFF') navigate('/staff/overview');
    else if (role === 'CUSTOMER') navigate('/portal/dashboard');
  };

  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const section = parts[0]?.toUpperCase() || '';
    const page = parts[1]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';
    return `${section} / ${page}`;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar - Desktop */}
      <aside
        style={{ backgroundColor: '#18253B' }}
        className="hidden md:flex flex-col w-64 shrink-0 text-slate-300 border-r border-slate-800 z-30 select-none fixed inset-y-0 left-0 no-print"
      >
        {/* Brand Lockup */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-950/20">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-base leading-none">Subnexa</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Brightloop SaaS
            </span>
          </div>
        </div>

        {/* Role Switcher Pill in Sidebar */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
            <span>Prototype Role</span>
            <span className="text-indigo-400 text-[10px] font-mono">Demo Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`px-1.5 py-1 text-[11px] font-semibold rounded-md transition-all text-center cursor-pointer ${
                currentUser.role === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleChange('STAFF')}
              className={`px-1.5 py-1 text-[11px] font-semibold rounded-md transition-all text-center cursor-pointer ${
                currentUser.role === 'STAFF'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => handleRoleChange('CUSTOMER')}
              className={`px-1.5 py-1 text-[11px] font-semibold rounded-md transition-all text-center cursor-pointer ${
                currentUser.role === 'CUSTOMER'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Role Specific Nav */}
          {currentUser.role === 'ADMIN' && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Administration</span>
              </div>
              <nav className="space-y-0.5">
                {adminNav.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {currentUser.role === 'STAFF' && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Staff Operations</span>
              </div>
              <nav className="space-y-0.5">
                {staffNav.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {currentUser.role === 'CUSTOMER' && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Customer Portal</span>
              </div>
              <nav className="space-y-0.5">
                {customerNav.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Finance & Revenue Section (Accessible to Admin & Staff) */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-indigo-400" />
                <span>Finance & Analytics</span>
              </div>
              <nav className="space-y-0.5">
                {financeNav.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar Footer: Current User & Reset */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={resetToDemoData}
              title="Reset seeded demo data"
              className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Switch / Demo Login</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Bar adhering to Top Bar Contract */}
        <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between gap-6 sticky top-0 z-20 no-print">
          {/* Zone 1: Mobile toggle & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-400 hidden sm:inline">
                Subnexa
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs font-medium text-slate-700 font-mono">{getBreadcrumbs()}</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition-colors whitespace-nowrap">
              Admin
            </Link>
            <Link to="/staff/overview" className="hover:text-indigo-600 transition-colors whitespace-nowrap">
              Staff Ops
            </Link>
            <Link to="/portal/dashboard" className="hover:text-indigo-600 transition-colors whitespace-nowrap">
              Client Portal
            </Link>
            <Link to="/finance/overview" className="hover:text-indigo-600 transition-colors whitespace-nowrap">
              Finance
            </Link>
          </nav>

          {/* Zone 3: 1 Primary Action / User Profile dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick user switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold truncate max-w-[120px]">{currentUser.name}</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">Switch Demo Account</p>
                    <p className="text-[11px] text-slate-500">Fast 1-click preview testing</p>
                  </div>
                  <div className="py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setRoleDropdownOpen(false);
                          if (u.role === 'ADMIN') navigate('/admin/dashboard');
                          else if (u.role === 'STAFF') navigate('/staff/overview');
                          else navigate('/portal/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                          u.id === currentUser.id ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1 mt-1 px-2">
                    <button
                      onClick={() => {
                        resetToDemoData();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Seed Database</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
            <div
              style={{ backgroundColor: '#18253B' }}
              className="w-72 h-full text-slate-300 p-4 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-base">Subnexa Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase font-bold text-slate-400">Navigation</p>
                  {[...adminNav, ...staffNav, ...customerNav, ...financeNav].map((n) => (
                    <Link
                      key={n.path}
                      to={n.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
