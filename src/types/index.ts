// User & Auth Types
export type UserRole = 'kasir' | 'apoteker' | 'gudang' | 'manager' | 'owner' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
  branchName: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
}

// Product & Inventory Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  price: number;
  requiresPrescription: boolean;
  batches: ProductBatch[];
}

export interface ProductBatch {
  id: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Cart & Transaction Types
export interface CartItem {
  id: string;
  product: Product;
  batch: ProductBatch;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface HeldTransaction {
  id: string;
  label: string;
  items: CartItem[];
  createdAt: string;
  customerId?: string;
  customerName?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  branchId: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  payments: Payment[];
  pointsEarned: number;
  pointsUsed: number;
  status: 'completed' | 'voided' | 'refunded';
  createdAt: string;
}

// Payment Types
export type PaymentMethod = 'cash' | 'qris' | 'card' | 'transfer' | 'points';

export interface Payment {
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: 'pending' | 'success' | 'failed';
}

// Membership Types
export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  pointsBalance: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
}

// Shift Types
export interface Shift {
  id: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  difference?: number;
  notes?: string;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
  transactions: string[];
}

// Approval Types
export type ApprovalType = 'discount' | 'void' | 'refund' | 'adjustment' | 'points_overlimit';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  requesterId: string;
  requesterName: string;
  branchId: string;
  branchName: string;
  transactionId?: string;
  amount?: number;
  reason: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  reviewerName?: string;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
  details: Record<string, unknown>;
}

// Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  branchId: string;
  branchName: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Dashboard KPI Types
export interface KPIData {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface SalesTrend {
  date: string;
  sales: number;
  transactions: number;
}

export interface BranchPerformance {
  branchId: string;
  branchName: string;
  sales: number;
  transactions: number;
  avgTicket: number;
}

export interface RedFlag {
  id: string;
  branchId: string;
  branchName: string;
  type: 'high_void' | 'high_adjustment' | 'high_reprint' | 'stockout' | 'expired';
  severity: 'low' | 'medium' | 'high';
  description: string;
  value: number;
  threshold: number;
  createdAt: string;
}
