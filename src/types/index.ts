export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  customerId?: string; // Links to customer record if role is CUSTOMER
  department?: string;
  active: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ONBOARDING';
  registeredDate: string;
  notes?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceAdjustment: number; // e.g. +560
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  type: 'SERVICE' | 'SOFTWARE_LICENSE' | 'INFRASTRUCTURE' | 'SUPPORT_PLAN';
  salesPrice: number; // base price in INR
  costPrice: number;
  notes?: string;
  active: boolean;
  variants: ProductVariant[];
  createdAt: string;
}

export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface SubscriptionPlan {
  id: string;
  name: string;
  productId: string;
  billingInterval: BillingInterval;
  intervalCount: number; // usually 1
  price: number; // base plan price
  currency: string; // 'INR'
  minQuantity: number;
  availabilityStartDate: string;
  availabilityEndDate?: string;
  autoCloseAfterCycles?: number;
  allowPause: boolean;
  trialDays: number;
  active: boolean;
  description: string;
}

export interface TaxRule {
  id: string;
  name: string;
  code: string; // e.g., GST-18, IGST-18, SGST-9
  percentage: number;
  applicability: 'ALL' | 'DOMESTIC' | 'INTERSTATE' | 'EXPORT';
  active: boolean;
  description?: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number; // e.g. 15 for 15% or 5000 for ₹5000
  minPurchaseAmount?: number;
  minQuantity?: number;
  startDate: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  scope: 'SUBSCRIPTION_WIDE' | 'PRODUCT_SPECIFIC';
  applicableProductIds?: string[];
  active: boolean;
}

export interface QuotationLineItem {
  id: string;
  productId: string;
  variantId?: string;
  planId: string;
  description: string;
  quantity: number;
  unitPrice: number; // base + variant adjustment
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. QT-2026-001
  customerId: string;
  createdByStaffId: string;
  issueDate: string;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';
  convertedSubscriptionId?: string;
  templateName: string;
  notes?: string;
  terms: string;
  items: QuotationLineItem[];
  subtotal: number;
  taxRuleId?: string;
  taxRate: number;
  totalTax: number;
  discountRuleId?: string;
  totalDiscount: number;
  grandTotal: number;
}

export type SubscriptionStatus = 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface SubscriptionLineItem {
  id: string;
  productId: string;
  variantId?: string;
  planId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string; // e.g. SUB-2026-089
  customerId: string;
  planId: string;
  quotationId?: string;
  status: SubscriptionStatus;
  startDate: string;
  expiryDate?: string;
  nextBillingDate: string;
  lastBilledDate?: string;
  billingInterval: BillingInterval;
  paymentTerms: 'NET_0' | 'NET_15' | 'NET_30' | 'DUE_ON_RECEIPT';
  items: SubscriptionLineItem[];
  subtotal: number;
  taxRuleId?: string;
  taxAmount: number;
  discountRuleId?: string;
  discountAmount: number;
  totalAmount: number;
  autoRenew: boolean;
  notes?: string;
  createdAt: string;
}

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0412
  customerId: string;
  subscriptionId?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  taxRuleName?: string;
  taxRate?: number;
  discountAmount: number;
  discountRuleName?: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  items: InvoiceLineItem[];
  billingCycleKey: string; // e.g. SUB_ID_YYYY-MM-DD to guarantee idempotency!
  notes?: string;
  paymentInstructions?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. PAY-2026-104
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'NEFT_RTGS' | 'CREDIT_CARD' | 'NET_BANKING' | 'CHEQUE';
  paymentDate: string;
  referenceNumber: string;
  notes?: string;
  recordedByUserId: string;
  recordedByName: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface BillingRunLog {
  id: string;
  runDate: string;
  targetDate: string;
  executedBy: string;
  subscriptionsProcessed: number;
  invoicesGeneratedCount: number;
  skippedDuplicatesCount: number;
  totalBilledAmount: number;
  invoiceIds: string[];
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  details: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
