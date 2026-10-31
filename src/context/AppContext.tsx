import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Customer,
  Product,
  SubscriptionPlan,
  TaxRule,
  DiscountRule,
  Subscription,
  Invoice,
  Payment,
  Quotation,
  BillingRunLog,
  ToastMessage,
  SubscriptionStatus,
  InvoiceStatus,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_PLANS,
  INITIAL_TAX_RULES,
  INITIAL_DISCOUNT_RULES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_QUOTATIONS,
  INITIAL_BILLING_LOGS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  setUserRole: (role: UserRole) => void;
  users: User[];
  customers: Customer[];
  products: Product[];
  plans: SubscriptionPlan[];
  taxRules: TaxRule[];
  discountRules: DiscountRule[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
  quotations: Quotation[];
  billingLogs: BillingRunLog[];
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Plan actions
  addPlan: (plan: Omit<SubscriptionPlan, 'id'>) => SubscriptionPlan;
  updatePlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  deletePlan: (id: string) => void;
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'registeredDate'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  // Tax & Discount actions
  addTaxRule: (rule: Omit<TaxRule, 'id'>) => TaxRule;
  updateTaxRule: (id: string, updates: Partial<TaxRule>) => void;
  addDiscountRule: (rule: Omit<DiscountRule, 'id' | 'usedCount'>) => DiscountRule;
  updateDiscountRule: (id: string, updates: Partial<DiscountRule>) => void;
  // Quotation actions
  createQuotation: (data: Omit<Quotation, 'id' | 'quotationNumber' | 'status'>) => Quotation;
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  convertQuotationToSubscription: (quotationId: string) => Subscription;
  // Subscription actions
  createSubscription: (data: Omit<Subscription, 'id' | 'subscriptionNumber' | 'createdAt'>) => Subscription;
  updateSubscriptionStatus: (id: string, status: SubscriptionStatus) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  // Billing run
  runRecurringBilling: (targetDate: string) => {
    processed: number;
    generated: number;
    skipped: number;
    totalAmount: number;
    invoiceIds: string[];
  };
  // Invoice actions
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  // Payment actions
  recordPayment: (data: {
    invoiceId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    referenceNumber: string;
    notes?: string;
    paymentDate: string;
  }) => Payment;
  // Reset
  resetToDemoData: () => void;
  // Metrics helpers
  getMetrics: () => {
    mrr: number;
    arr: number;
    totalReceived: number;
    outstandingRevenue: number;
    overdueRevenue: number;
    activeSubscriptionsCount: number;
    totalCustomersCount: number;
  };
}

const STORAGE_PREFIX = 'subnexa_v1_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return defaultVal;
  };

  const [users, setUsers] = useState<User[]>(() => loadState('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    const found = users.find((u) => u.id === savedUserId);
    return found || users[0] || INITIAL_USERS[0];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => loadState('customers', INITIAL_CUSTOMERS));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', INITIAL_PRODUCTS));
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => loadState('plans', INITIAL_PLANS));
  const [taxRules, setTaxRules] = useState<TaxRule[]>(() => loadState('tax_rules', INITIAL_TAX_RULES));
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(() => loadState('discount_rules', INITIAL_DISCOUNT_RULES));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadState('subscriptions', INITIAL_SUBSCRIPTIONS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<Payment[]>(() => loadState('payments', INITIAL_PAYMENTS));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadState('quotations', INITIAL_QUOTATIONS));
  const [billingLogs, setBillingLogs] = useState<BillingRunLog[]>(() => loadState('billing_logs', INITIAL_BILLING_LOGS));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUser.id);
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'plans', JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tax_rules', JSON.stringify(taxRules));
  }, [taxRules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'discount_rules', JSON.stringify(discountRules));
  }, [discountRules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'quotations', JSON.stringify(quotations));
  }, [quotations]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'billing_logs', JSON.stringify(billingLogs));
  }, [billingLogs]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addToast({
        type: 'info',
        title: `Switched User Profile`,
        message: `Now operating as ${user.name} (${user.role})`,
      });
    }
  };

  const setUserRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
      addToast({
        type: 'info',
        title: `Switched to ${role} Role`,
        message: `Logged in as ${userForRole.name}`,
      });
    }
  };

  // Product actions
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast({
      type: 'success',
      title: 'Product Created',
      message: `${newProd.name} added with ${newProd.variants.length} variant(s).`,
    });
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Product specifications and pricing updated.',
    });
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Product Deleted',
      message: `${prod?.name || 'Product'} has been removed.`,
    });
  };

  // Plan actions
  const addPlan = (planData: Omit<SubscriptionPlan, 'id'>): SubscriptionPlan => {
    const newPlan: SubscriptionPlan = {
      ...planData,
      id: `plan-${Date.now()}`,
    };
    setPlans((prev) => [newPlan, ...prev]);
    addToast({
      type: 'success',
      title: 'Subscription Plan Created',
      message: `${newPlan.name} is now available.`,
    });
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setPlans((prev) => prev.map((pl) => (pl.id === id ? { ...pl, ...updates } : pl)));
    addToast({
      type: 'success',
      title: 'Plan Updated',
      message: 'Subscription plan parameters updated.',
    });
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Plan Removed',
      message: 'Subscription plan has been archived.',
    });
  };

  // Customer actions
  const addCustomer = (custData: Omit<Customer, 'id' | 'registeredDate'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCust.name} (${newCust.company}) onboarded.`,
    });
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast({
      type: 'success',
      title: 'Customer Updated',
      message: 'Customer profile details updated successfully.',
    });
  };

  // Tax & Discount actions
  const addTaxRule = (rule: Omit<TaxRule, 'id'>): TaxRule => {
    const newRule: TaxRule = { ...rule, id: `tax-${Date.now()}` };
    setTaxRules((prev) => [...prev, newRule]);
    addToast({
      type: 'success',
      title: 'Tax Rule Created',
      message: `${newRule.name} (${newRule.percentage}%) active.`,
    });
    return newRule;
  };

  const updateTaxRule = (id: string, updates: Partial<TaxRule>) => {
    setTaxRules((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast({
      type: 'success',
      title: 'Tax Rule Updated',
    });
  };

  const addDiscountRule = (rule: Omit<DiscountRule, 'id' | 'usedCount'>): DiscountRule => {
    const newRule: DiscountRule = { ...rule, id: `disc-${Date.now()}`, usedCount: 0 };
    setDiscountRules((prev) => [...prev, newRule]);
    addToast({
      type: 'success',
      title: 'Discount Created',
      message: `Coupon/Policy ${newRule.code} created.`,
    });
    return newRule;
  };

  const updateDiscountRule = (id: string, updates: Partial<DiscountRule>) => {
    setDiscountRules((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addToast({
      type: 'success',
      title: 'Discount Rule Updated',
    });
  };

  // Quotation actions
  const createQuotation = (data: Omit<Quotation, 'id' | 'quotationNumber' | 'status'>): Quotation => {
    const quotationCount = quotations.length + 1;
    const quotationNumber = `QT-2026-${String(quotationCount).padStart(3, '0')}`;
    const newQuotation: Quotation = {
      ...data,
      id: `qt-${Date.now()}`,
      quotationNumber,
      status: 'SENT',
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    addToast({
      type: 'success',
      title: 'Quotation Generated',
      message: `Quotation ${quotationNumber} issued for ${newQuotation.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`,
    });
    return newQuotation;
  };

  const updateQuotationStatus = (id: string, status: Quotation['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    addToast({
      type: 'info',
      title: 'Quotation Status Updated',
      message: `Quotation status changed to ${status}`,
    });
  };

  const convertQuotationToSubscription = (quotationId: string): Subscription => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    const subCount = subscriptions.length + 1;
    const subscriptionNumber = `SUB-2026-${String(subCount).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    // default next billing 1 month out
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextBillingDate = nextMonth.toISOString().split('T')[0];

    const firstItem = quote.items[0];
    const plan = plans.find((p) => p.id === firstItem?.planId) || plans[0];

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      subscriptionNumber,
      customerId: quote.customerId,
      planId: plan.id,
      quotationId: quote.id,
      status: 'CONFIRMED',
      startDate: today,
      nextBillingDate: today, // Can be billed immediately in recurring center!
      billingInterval: plan.billingInterval || 'MONTHLY',
      paymentTerms: 'NET_15',
      items: quote.items.map((qi, idx) => ({
        id: `sli-${Date.now()}-${idx}`,
        productId: qi.productId,
        variantId: qi.variantId,
        planId: qi.planId,
        quantity: qi.quantity,
        unitPrice: qi.unitPrice,
        total: qi.quantity * qi.unitPrice,
      })),
      subtotal: quote.subtotal,
      taxRuleId: quote.taxRuleId,
      taxAmount: quote.totalTax,
      discountRuleId: quote.discountRuleId,
      discountAmount: quote.totalDiscount,
      totalAmount: quote.grandTotal,
      autoRenew: true,
      notes: `Converted from quotation ${quote.quotationNumber}. ${quote.notes || ''}`,
      createdAt: new Date().toISOString(),
    };

    setSubscriptions((prev) => [newSub, ...prev]);

    // Update quotation status
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'CONVERTED', convertedSubscriptionId: newSub.id } : q))
    );

    addToast({
      type: 'success',
      title: 'Quotation Converted',
      message: `Created subscription ${subscriptionNumber} from ${quote.quotationNumber}`,
    });

    return newSub;
  };

  // Subscription actions
  const createSubscription = (data: Omit<Subscription, 'id' | 'subscriptionNumber' | 'createdAt'>): Subscription => {
    const count = subscriptions.length + 1;
    const subscriptionNumber = `SUB-2026-${String(count).padStart(3, '0')}`;
    const newSub: Subscription = {
      ...data,
      id: `sub-${Date.now()}`,
      subscriptionNumber,
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    addToast({
      type: 'success',
      title: 'Subscription Created',
      message: `${subscriptionNumber} recorded successfully.`,
    });
    return newSub;
  };

  const updateSubscriptionStatus = (id: string, status: SubscriptionStatus) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    addToast({
      type: 'info',
      title: 'Subscription Status Updated',
      message: `Subscription transitioned to ${status}`,
    });
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    addToast({
      type: 'success',
      title: 'Subscription Updated',
      message: 'Subscription parameters updated successfully.',
    });
  };

  // Recurring Billing Run Engine
  const runRecurringBilling = (targetDate: string) => {
    const activeSubs = subscriptions.filter(
      (s) => (s.status === 'ACTIVE' || s.status === 'CONFIRMED') && s.nextBillingDate <= targetDate
    );

    let generatedCount = 0;
    let skippedCount = 0;
    let totalBilled = 0;
    const newInvoices: Invoice[] = [];
    const generatedInvoiceIds: string[] = [];
    const updatedSubs = [...subscriptions];

    for (const sub of activeSubs) {
      // Idempotency check: unique billing cycle key
      const cycleKey = `${sub.id}_${sub.nextBillingDate}`;
      const alreadyInvoiced = invoices.some((inv) => inv.billingCycleKey === cycleKey);

      if (alreadyInvoiced) {
        skippedCount++;
        continue;
      }

      // Generate invoice
      const invoiceNumber = `INV-2026-${String(invoices.length + newInvoices.length + 1).padStart(4, '0')}`;
      const customer = customers.find((c) => c.id === sub.customerId);
      const taxRule = taxRules.find((t) => t.id === sub.taxRuleId);
      const discountRule = discountRules.find((d) => d.id === sub.discountRuleId);

      // Calculate line items
      const invoiceItems = sub.items.map((item, idx) => {
        const prod = products.find((p) => p.id === item.productId);
        const variant = prod?.variants.find((v) => v.id === item.variantId);
        const desc = `${prod?.name || 'Software Subscription'}${variant ? ` - ${variant.name}` : ''}`;
        const itemAmount = item.quantity * item.unitPrice;
        return {
          id: `ili-${Date.now()}-${idx}`,
          description: desc,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: itemAmount,
          taxAmount: (sub.taxAmount * (itemAmount / (sub.subtotal || 1))),
          discountAmount: (sub.discountAmount * (itemAmount / (sub.subtotal || 1))),
          total: (itemAmount - sub.discountAmount + sub.taxAmount),
        };
      });

      // Calculate due date (NET 15 default)
      const dueDateObj = new Date(targetDate);
      dueDateObj.setDate(dueDateObj.getDate() + 15);
      const dueDate = dueDateObj.toISOString().split('T')[0];

      const periodEndDateObj = new Date(targetDate);
      if (sub.billingInterval === 'YEARLY') {
        periodEndDateObj.setFullYear(periodEndDateObj.getFullYear() + 1);
      } else if (sub.billingInterval === 'WEEKLY') {
        periodEndDateObj.setDate(periodEndDateObj.getDate() + 7);
      } else if (sub.billingInterval === 'DAILY') {
        periodEndDateObj.setDate(periodEndDateObj.getDate() + 1);
      } else {
        periodEndDateObj.setMonth(periodEndDateObj.getMonth() + 1);
      }
      const periodEnd = periodEndDateObj.toISOString().split('T')[0];

      const newInv: Invoice = {
        id: `inv-${Date.now()}-${newInvoices.length}`,
        invoiceNumber,
        customerId: sub.customerId,
        subscriptionId: sub.id,
        billingPeriodStart: sub.nextBillingDate,
        billingPeriodEnd: periodEnd,
        invoiceDate: targetDate,
        dueDate,
        status: 'CONFIRMED',
        subtotal: sub.subtotal,
        taxAmount: sub.taxAmount,
        taxRuleName: taxRule ? `${taxRule.name} (${taxRule.percentage}%)` : 'GST 18%',
        taxRate: taxRule ? taxRule.percentage : 18,
        discountAmount: sub.discountAmount,
        discountRuleName: discountRule ? `${discountRule.code} (${discountRule.value}${discountRule.type === 'PERCENTAGE' ? '%' : ' INR'})` : undefined,
        totalAmount: sub.totalAmount,
        paidAmount: 0,
        outstandingAmount: sub.totalAmount,
        items: invoiceItems,
        billingCycleKey: cycleKey,
        notes: `Recurring cycle invoice for ${customer?.company || 'Subscriber'}.`,
        paymentInstructions: 'Transfer to Brightloop Software HDFC A/C: 50200049281729, IFSC: HDFC0000240, UPI: brightloop@hdfcbank',
        createdAt: new Date().toISOString(),
      };

      newInvoices.push(newInv);
      generatedInvoiceIds.push(newInv.id);
      totalBilled += newInv.totalAmount;
      generatedCount++;

      // Advance next billing date and mark subscription ACTIVE if it was confirmed
      const subIdx = updatedSubs.findIndex((s) => s.id === sub.id);
      if (subIdx !== -1) {
        updatedSubs[subIdx] = {
          ...updatedSubs[subIdx],
          status: 'ACTIVE',
          lastBilledDate: targetDate,
          nextBillingDate: periodEnd,
        };
      }
    }

    if (newInvoices.length > 0) {
      setInvoices((prev) => [...newInvoices, ...prev]);
      setSubscriptions(updatedSubs);
    }

    // Save Billing Log
    const newLog: BillingRunLog = {
      id: `log-${Date.now()}`,
      runDate: new Date().toISOString(),
      targetDate,
      executedBy: `${currentUser.name} (${currentUser.role})`,
      subscriptionsProcessed: activeSubs.length,
      invoicesGeneratedCount: generatedCount,
      skippedDuplicatesCount: skippedCount,
      totalBilledAmount: totalBilled,
      invoiceIds: generatedInvoiceIds,
      status: generatedCount > 0 ? 'SUCCESS' : skippedCount > 0 ? 'SUCCESS' : 'SUCCESS',
      details: `Processed ${activeSubs.length} candidate subscription(s). Generated ${generatedCount} invoice(s), ${skippedCount} duplicate(s) prevented.`,
    };

    setBillingLogs((prev) => [newLog, ...prev]);

    addToast({
      type: generatedCount > 0 ? 'success' : 'info',
      title: 'Recurring Billing Run Finished',
      message: `Generated ${generatedCount} invoice(s) totaling ${totalBilled.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}. Skipped ${skippedCount} existing cycles.`,
    });

    return {
      processed: activeSubs.length,
      generated: generatedCount,
      skipped: skippedCount,
      totalAmount: totalBilled,
      invoiceIds: generatedInvoiceIds,
    };
  };

  // Invoice actions
  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    addToast({
      type: 'info',
      title: 'Invoice Status Updated',
      message: `Invoice marked as ${status}`,
    });
  };

  // Payment recording
  const recordPayment = (data: {
    invoiceId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    referenceNumber: string;
    notes?: string;
    paymentDate: string;
  }): Payment => {
    const inv = invoices.find((i) => i.id === data.invoiceId);
    if (!inv) throw new Error('Invoice not found');

    const customer = customers.find((c) => c.id === inv.customerId);
    const paymentCount = payments.length + 1;
    const paymentNumber = `PAY-2026-${String(paymentCount).padStart(3, '0')}`;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      paymentNumber,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customerId,
      customerName: customer ? `${customer.name} (${customer.company})` : 'Customer',
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
      recordedByUserId: currentUser.id,
      recordedByName: currentUser.name,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    // Calculate updated invoice paid and outstanding amounts
    const updatedPaid = inv.paidAmount + data.amount;
    const updatedOutstanding = Math.max(0, inv.totalAmount - updatedPaid);
    let newStatus: InvoiceStatus = inv.status;

    if (updatedOutstanding <= 0.01) {
      newStatus = 'PAID';
    } else if (updatedPaid > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    setPayments((prev) => [newPayment, ...prev]);
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              paidAmount: updatedPaid,
              outstandingAmount: updatedOutstanding,
              status: newStatus,
            }
          : i
      )
    );

    addToast({
      type: 'success',
      title: 'Payment Recorded',
      message: `Recorded ${data.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} for ${inv.invoiceNumber}. Invoice is now ${newStatus}.`,
    });

    return newPayment;
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setPlans(INITIAL_PLANS);
    setTaxRules(INITIAL_TAX_RULES);
    setDiscountRules(INITIAL_DISCOUNT_RULES);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setQuotations(INITIAL_QUOTATIONS);
    setBillingLogs(INITIAL_BILLING_LOGS);
    addToast({
      type: 'info',
      title: 'Demo Environment Reset',
      message: 'All prototype databases refreshed to initial seeded state.',
    });
  };

  // Metrics helper for Dashboards & Analytics
  const getMetrics = () => {
    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');

    // Calculate MRR: normalize yearly to /12, weekly to *4.33, daily to *30
    const mrr = activeSubs.reduce((acc, sub) => {
      if (sub.billingInterval === 'YEARLY') return acc + sub.totalAmount / 12;
      if (sub.billingInterval === 'WEEKLY') return acc + sub.totalAmount * 4.33;
      if (sub.billingInterval === 'DAILY') return acc + sub.totalAmount * 30;
      return acc + sub.totalAmount;
    }, 0);

    const arr = mrr * 12;

    const totalReceived = payments.reduce((acc, p) => acc + p.amount, 0);

    const outstandingRevenue = invoices
      .filter((inv) => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
      .reduce((acc, inv) => acc + inv.outstandingAmount, 0);

    const overdueRevenue = invoices
      .filter((inv) => inv.status === 'OVERDUE')
      .reduce((acc, inv) => acc + inv.outstandingAmount, 0);

    return {
      mrr,
      arr,
      totalReceived,
      outstandingRevenue,
      overdueRevenue,
      activeSubscriptionsCount: activeSubs.length,
      totalCustomersCount: customers.length,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        setUserRole,
        users,
        customers,
        products,
        plans,
        taxRules,
        discountRules,
        subscriptions,
        invoices,
        payments,
        quotations,
        billingLogs,
        toasts,
        addToast,
        removeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        addPlan,
        updatePlan,
        deletePlan,
        addCustomer,
        updateCustomer,
        addTaxRule,
        updateTaxRule,
        addDiscountRule,
        updateDiscountRule,
        createQuotation,
        updateQuotationStatus,
        convertQuotationToSubscription,
        createSubscription,
        updateSubscriptionStatus,
        updateSubscription,
        runRecurringBilling,
        updateInvoiceStatus,
        recordPayment,
        resetToDemoData,
        getMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
