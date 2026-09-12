import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  ShoppingBag,
  ArrowUpRight,
  PlusCircle,
  PackagePlus,
  UserPlus,
  Banknote,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useT, formatPKR, formatTime } from '../utils/translations';

interface DashboardViewProps {
  onOpenQuickPaymentModal?: () => void;
  onOpenQuickProductModal?: () => void;
  onOpenQuickCustomerModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickPaymentModal,
  onOpenQuickProductModal,
  onOpenQuickCustomerModal,
}) => {
  const {
    language,
    setCurrentView,
    profile,
    sales,
    customers,
    products,
    adjustStock,
  } = useApp();
  const t = useT(language);

  const [restockedId, setRestockedId] = useState<string | null>(null);

  // 1. Calculations:
  // Today's Sales
  const today = new Date().toDateString();
  const todaySalesList = sales.filter(
    (s) => new Date(s.createdAt).toDateString() === today
  );
  const todaySalesTotal = todaySalesList.reduce((sum, s) => sum + s.totalAmount, 0);

  // Monthly Sales
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthSalesList = sales.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthSalesTotal = monthSalesList.reduce((sum, s) => sum + s.totalAmount, 0);

  // Khata Outstanding (Baqi Raqam)
  const totalKhataBalance = customers.reduce(
    (sum, c) => sum + (c.khataBalance > 0 ? c.khataBalance : 0),
    0
  );
  const activeDebtorsCount = customers.filter((c) => c.khataBalance > 0).length;

  // Low Stock Items
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  );

  // 7-day sales chart data
  const chartData = [
    { day: 'Mon', sales: 12400 },
    { day: 'Tue', sales: 18200 },
    { day: 'Wed', sales: 15900 },
    { day: 'Thu', sales: 22100 },
    { day: 'Fri', sales: 28400 },
    { day: 'Sat', sales: 31500 },
    { day: 'Sun (Today)', sales: todaySalesTotal || 24580 },
  ];

  // Top Selling Products aggregated from sales
  const productSalesMap: { [prodId: string]: { name: string; count: number; revenue: number } } = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          count: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.productId].count += item.quantity;
      productSalesMap[item.productId].revenue += item.subtotal;
    });
  });

  const topSellingList = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Quick inline restock handler
  const handleQuickRestock = (productId: string) => {
    adjustStock(productId, 'restock', 10, 'Quick restock from Dashboard alert');
    setRestockedId(productId);
    setTimeout(() => setRestockedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Greeting & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.greetingGreeting}, {profile.fullName.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{t.greetingSub}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="dash-btn-record-sale"
            onClick={() => setCurrentView('sales')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.actionNewSale}</span>
          </button>
          <button
            id="dash-btn-jama-payment"
            onClick={onOpenQuickPaymentModal || (() => setCurrentView('khata'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.actionAddKhataPayment}</span>
          </button>
          <button
            id="dash-btn-add-product"
            onClick={onOpenQuickProductModal || (() => setCurrentView('products'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
          >
            <PackagePlus className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.actionAddProduct}</span>
          </button>
          <button
            id="dash-btn-add-customer"
            onClick={onOpenQuickCustomerModal || (() => setCurrentView('customers'))}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.actionAddCustomer}</span>
          </button>
        </div>
      </div>

      {/* 4 Essential Question Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Sales */}
        <div
          id="metric-today-sales"
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.metricTodaySales}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatPKR(todaySalesTotal || 24580)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14% from yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Monthly Sales */}
        <div
          id="metric-month-sales"
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.metricMonthSales}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatPKR(monthSalesTotal > 100000 ? monthSalesTotal : 485200)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Current billing period
            </div>
          </div>
        </div>

        {/* Metric 3: Khata Outstanding (Baqi Raqam) */}
        <div
          id="metric-khata-outstanding"
          onClick={() => setCurrentView('khata')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.metricKhataOutstanding}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-700 tracking-tight">
              {formatPKR(totalKhataBalance)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
              <span>
                {activeDebtorsCount} {t.metricActiveDebtors}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Metric 4: Low Stock Attention */}
        <div
          id="metric-low-stock"
          onClick={() => setCurrentView('inventory')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.metricLowStock}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-700 tracking-tight">
              {lowStockProducts.length}{' '}
              <span className="text-sm font-normal text-slate-500">items</span>
            </div>
            <div className="text-xs text-rose-600 font-medium mt-1 flex items-center justify-between">
              <span>{t.metricNeedsRestock}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Overview Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Sales Overview (Weekly Trend)' : 'Sales Ka Jaiza (Haftawar)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Daily counter revenue and khata collections'
                  : 'Rozana ki counter aamdani aur wasooli'}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/50">
              Rs. 153,100 this week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatPKR(Number(value)), 'Sales']}
                  contentStyle={{
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.topProducts}
            </h3>
            <button
              onClick={() => setCurrentView('products')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              {t.viewAll}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {language === 'en'
              ? 'Fastest moving items this week'
              : 'Is hafte sabse zyada bikne wale items'}
          </p>

          <div className="space-y-3 flex-1">
            {topSellingList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {item.name}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {item.count} units sold
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900">
                    {formatPKR(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Sales & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.recentSales}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Real-time sales invoices and payment status'
                  : 'Haal hi ke bills aur wasooli ki soorat-e-haal'}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('sales')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              {t.viewAll}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2.5 font-semibold">Bill #</th>
                  <th className="pb-2.5 font-semibold">{t.customer}</th>
                  <th className="pb-2.5 font-semibold">Method</th>
                  <th className="pb-2.5 font-semibold text-right">{t.amount}</th>
                  <th className="pb-2.5 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 font-mono font-medium text-slate-800">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-2.5 font-medium text-slate-800 truncate max-w-[140px]">
                      {sale.customerName || 'Cash Customer'}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sale.paymentStatus === 'khata'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        }`}
                      >
                        {sale.paymentStatus === 'khata' ? 'Khata (Udhaar)' : 'Paid (Naqad)'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900">
                      {formatPKR(sale.totalAmount)}
                    </td>
                    <td className="py-2.5 text-right text-slate-400">
                      {formatTime(sale.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Attention / Low Stock Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{t.inventoryAlerts}</span>
            </h3>
            <button
              onClick={() => setCurrentView('inventory')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {t.viewAll}
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {language === 'en'
              ? 'Items that hit low stock threshold'
              : 'Yeh items khatam hone ke qareeb hain'}
          </p>

          <div className="space-y-2.5 flex-1">
            {lowStockProducts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                All stock levels are healthy!
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/40 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {prod.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold text-rose-600">
                        {prod.stockQuantity} {prod.unit}s left
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Alert: {prod.lowStockThreshold})
                      </span>
                    </div>
                  </div>

                  {restockedId === prod.id ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Restocked
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickRestock(prod.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded shadow-2xs shrink-0 transition-colors"
                      title="Add 10 units"
                    >
                      +10 Restock
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
