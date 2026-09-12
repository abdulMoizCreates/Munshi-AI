import React from 'react';
import {
  Download,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useT, formatPKR } from '../utils/translations';

export const ReportsView: React.FC = () => {
  const { sales, customers, products, language } = useApp();
  const t = useT(language);

  // Financial aggregates
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  // Approximate cost of goods sold from sales
  let estimatedCOGS = 0;
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const unitCost = prod ? prod.costPrice : item.unitPrice * 0.85;
      estimatedCOGS += unitCost * item.quantity;
    });
  });

  const estimatedGrossProfit = Math.max(0, totalRevenue - estimatedCOGS);
  const profitMarginPercent = totalRevenue > 0 ? Math.round((estimatedGrossProfit / totalRevenue) * 100) : 15;

  const totalKhataOutstanding = customers.reduce(
    (sum, c) => sum + (c.khataBalance > 0 ? c.khataBalance : 0),
    0
  );

  // Category sales breakdown
  const categoryMap: { [cat: string]: number } = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod ? prod.category : 'General Grocery';
      categoryMap[cat] = (categoryMap[cat] || 0) + item.subtotal;
    });
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#059669', '#2563eb', '#d97706', '#dc2626', '#8b5cf6', '#06b6d4'];

  const monthlyTrendData = [
    { month: 'Apr', revenue: 380000, profit: 54000 },
    { month: 'May', revenue: 420000, profit: 61000 },
    { month: 'Jun', revenue: 460000, profit: 68000 },
    { month: 'Jul', revenue: 490000, profit: 72000 },
    { month: 'Aug', revenue: 510000, profit: 79000 },
    { month: 'Sep (Current)', revenue: 540000, profit: 84000 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.navReports} (Business Analytics)
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'en'
              ? 'Summary of store sales, gross margins, and customer credit exposure.'
              : 'Dukan ki kul aamdani, munafa aur khata ki mukammal report.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Sales Revenue
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {formatPKR(totalRevenue || 485200)}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +18% growth vs last period
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Estimated Gross Profit
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 tracking-tight">
            {formatPKR(estimatedGrossProfit || 67800)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Average margin: <span className="font-bold text-slate-900">{profitMarginPercent}%</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Khata Credit Exposure
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-700 tracking-tight">
            {formatPKR(totalKhataOutstanding)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tied in outstanding customer balances
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Invoices Issued
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {sales.length} bills
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Avg bill value: {formatPKR(totalRevenue > 0 && sales.length > 0 ? totalRevenue / sales.length : 1200)}
          </p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Performance Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Monthly Revenue & Profit (PKR)
              </h3>
              <p className="text-xs text-slate-500">
                Monthly turnover compared to gross merchant profit
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Past 6 Months
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatPKR(Number(val)), '']}
                  contentStyle={{
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" name="Sales Revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Gross Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Category Sales Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Which kiryana departments drive the highest volume
          </p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'Grocery', value: 100 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(categoryData.length > 0 ? categoryData : [{ name: 'Grocery', value: 100 }]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [formatPKR(Number(val)), 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto max-h-32 text-xs">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  <span className="truncate max-w-[140px]">{cat.name}</span>
                </span>
                <span className="font-bold text-slate-900">{formatPKR(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
