import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/common/ToastContainer';

// Auth Pages (Screens 1, 2, 3)
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Admin Pages (Screens 4, 5, 6, 7, 8, 9, 10)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { ProductsManagement } from './pages/admin/ProductsManagement';
import { PlansManagement } from './pages/admin/PlansManagement';
import { TaxDiscountManagement } from './pages/admin/TaxDiscountManagement';
import { SubscriptionsManagement } from './pages/admin/SubscriptionsManagement';
import { BillingCenter } from './pages/admin/BillingCenter';

// Staff Pages (Screens 11, 12, 13, 14)
import { StaffOverview } from './pages/staff/StaffOverview';
import { StaffCustomers } from './pages/staff/StaffCustomers';
import { StaffQuotations } from './pages/staff/StaffQuotations';
import { StaffOperations } from './pages/staff/StaffOperations';

// Customer Pages (Screens 15, 16, 17, 18)
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerSubscriptions } from './pages/customer/CustomerSubscriptions';
import { CustomerInvoices } from './pages/customer/CustomerInvoices';
import { CustomerAccount } from './pages/customer/CustomerAccount';

// Finance Pages (Screens 19, 20, 21)
import { FinanceOverview } from './pages/finance/FinanceOverview';
import { RevenueAnalytics } from './pages/finance/RevenueAnalytics';
import { FinanceReceivables } from './pages/finance/FinanceReceivables';

// Route Redirector based on Current User Role
const HomeRedirector: React.FC = () => {
  const { currentUser } = useApp();
  if (currentUser.role === 'STAFF') {
    return <Navigate to="/staff/overview" replace />;
  }
  if (currentUser.role === 'CUSTOMER') {
    return <Navigate to="/portal/dashboard" replace />;
  }
  return <Navigate to="/admin/dashboard" replace />;
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Root Redirector */}
          <Route path="/" element={<HomeRedirector />} />

          {/* Admin Routes (Wrapped in AppLayout) */}
          <Route
            path="/admin/dashboard"
            element={
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AppLayout>
                <UserManagement />
              </AppLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AppLayout>
                <ProductsManagement />
              </AppLayout>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <AppLayout>
                <PlansManagement />
              </AppLayout>
            }
          />
          <Route
            path="/admin/taxes-discounts"
            element={
              <AppLayout>
                <TaxDiscountManagement />
              </AppLayout>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <AppLayout>
                <SubscriptionsManagement />
              </AppLayout>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <AppLayout>
                <BillingCenter />
              </AppLayout>
            }
          />

          {/* Staff Routes (Wrapped in AppLayout) */}
          <Route
            path="/staff/overview"
            element={
              <AppLayout>
                <StaffOverview />
              </AppLayout>
            }
          />
          <Route
            path="/staff/customers"
            element={
              <AppLayout>
                <StaffCustomers />
              </AppLayout>
            }
          />
          <Route
            path="/staff/quotations"
            element={
              <AppLayout>
                <StaffQuotations />
              </AppLayout>
            }
          />
          <Route
            path="/staff/operations"
            element={
              <AppLayout>
                <StaffOperations />
              </AppLayout>
            }
          />

          {/* Customer Portal Routes (Wrapped in AppLayout) */}
          <Route
            path="/portal/dashboard"
            element={
              <AppLayout>
                <CustomerDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/portal/subscriptions"
            element={
              <AppLayout>
                <CustomerSubscriptions />
              </AppLayout>
            }
          />
          <Route
            path="/portal/invoices"
            element={
              <AppLayout>
                <CustomerInvoices />
              </AppLayout>
            }
          />
          <Route
            path="/portal/account"
            element={
              <AppLayout>
                <CustomerAccount />
              </AppLayout>
            }
          />

          {/* Finance Routes (Wrapped in AppLayout) */}
          <Route
            path="/finance/overview"
            element={
              <AppLayout>
                <FinanceOverview />
              </AppLayout>
            }
          />
          <Route
            path="/finance/analytics"
            element={
              <AppLayout>
                <RevenueAnalytics />
              </AppLayout>
            }
          />
          <Route
            path="/finance/receivables"
            element={
              <AppLayout>
                <FinanceReceivables />
              </AppLayout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<HomeRedirector />} />
        </Routes>

        {/* Global Toast Feedback System */}
        <ToastContainer />
      </HashRouter>
    </AppProvider>
  );
}
