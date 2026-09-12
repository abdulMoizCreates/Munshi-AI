export type Language = 'en' | 'ur';

export type UserRole = 'shopkeeper' | 'admin';

export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  shopId: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  phone: string;
  address: string;
  city: string;
  currency: string;
  createdAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  address: string;
  khataBalance: number; // positive = amount customer owes to shop (Baqi Raqam)
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  shopId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'khata' | 'partial';
  paidAmount: number;
  khataAmount: number;
  paymentMethod: 'cash' | 'khata' | 'digital';
  createdAt: string;
}

export interface KhataEntry {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  type: 'credit' | 'payment'; // 'credit' = udhaar, 'payment' = jama
  amount: number;
  note: string;
  saleId?: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  shopId: string;
  productId: string;
  productName: string;
  type: 'sale' | 'restock' | 'damage' | 'adjustment';
  quantity: number; // e.g. +20 or -5
  previousStock: number;
  newStock: number;
  note: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  shopId: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'pending' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  shopId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startAt: string;
  endAt: string;
  active: boolean;
}

export type ViewType = 
  | 'dashboard'
  | 'sales'
  | 'khata'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'orders'
  | 'offers'
  | 'reports'
  | 'settings';
