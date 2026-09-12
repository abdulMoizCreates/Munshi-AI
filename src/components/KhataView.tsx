import React, { useState } from 'react';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Share2,
  CheckCircle2,
  Calendar,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT, formatPKR, formatDateTime } from '../utils/translations';
import { Customer } from '../types';

export const KhataView: React.FC = () => {
  const { customers, khataEntries, addKhataPayment, addKhataCredit, language } = useApp();
  const t = useT(language);

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'debtors' | 'settled'>('debtors');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculations
  const totalBaqiRaqam = customers.reduce(
    (sum, c) => sum + (c.khataBalance > 0 ? c.khataBalance : 0),
    0
  );
  const debtorsCount = customers.filter((c) => c.khataBalance > 0).length;
  const settledCount = customers.filter((c) => c.khataBalance <= 0).length;

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    if (filterMode === 'debtors') return matchesSearch && c.khataBalance > 0;
    if (filterMode === 'settled') return matchesSearch && c.khataBalance <= 0;
    return matchesSearch;
  });

  // Customer specific ledger entries
  const customerEntries = activeCustomer
    ? khataEntries.filter((e) => e.customerId === activeCustomer.id)
    : [];

  // Handlers
  const handleOpenPayment = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setAmountInput(customer.khataBalance > 0 ? customer.khataBalance.toString() : '');
    setNoteInput('');
    setPaymentModalOpen(true);
  };

  const handleOpenCredit = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setAmountInput('');
    setNoteInput('');
    setCreditModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountInput);
    if (!amt || amt <= 0 || !selectedCustomerId) return;

    addKhataPayment(selectedCustomerId, amt, noteInput);
    setPaymentModalOpen(false);
    setAmountInput('');
    setNoteInput('');

    // Update activeCustomer view if open
    if (activeCustomer && activeCustomer.id === selectedCustomerId) {
      const updated = customers.find((c) => c.id === selectedCustomerId);
      if (updated) setActiveCustomer(updated);
    }
  };

  const handleSaveCredit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountInput);
    if (!amt || amt <= 0 || !selectedCustomerId) return;

    addKhataCredit(selectedCustomerId, amt, noteInput);
    setCreditModalOpen(false);
    setAmountInput('');
    setNoteInput('');

    if (activeCustomer && activeCustomer.id === selectedCustomerId) {
      const updated = customers.find((c) => c.id === selectedCustomerId);
      if (updated) setActiveCustomer(updated);
    }
  };

  const handleCopyReminder = (c: Customer) => {
    const msg = `Assalam-o-Alaikum ${c.name}, Madina General Store se guzarish hai ke aapka baqi khata raqam ${formatPKR(c.khataBalance)} hai. Baraye meherbani dukan par tashreef la kar hisab clear farma dein. JazakAllah!`;
    navigator.clipboard.writeText(msg);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Khata Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.khataBaqiRaqam} (Total Udhaar)
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-700 tracking-tight">
            {formatPKR(totalBaqiRaqam)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total money owed by customers to your shop
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Debtors
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {debtorsCount}{' '}
            <span className="text-sm font-normal text-slate-500">customers</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customers with outstanding balance
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Settled Accounts
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 tracking-tight">
            {settledCount}{' '}
            <span className="text-sm font-normal text-slate-500">customers</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Accounts with zero balance (Hisab saaf)
          </p>
        </div>
      </div>

      {/* Main Khata Directory & Search */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Filter & Search Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search customer name or phone...' : 'Gahak ka naam ya phone number likhein...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setFilterMode('debtors')}
              className={`px-3 py-1 rounded transition-colors ${
                filterMode === 'debtors'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baqi Raqam ({debtorsCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Customers ({customers.length})
            </button>
            <button
              onClick={() => setFilterMode('settled')}
              className={`px-3 py-1 rounded transition-colors ${
                filterMode === 'settled'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settled ({settledCount})
            </button>
          </div>
        </div>

        {/* Khata Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="p-3.5 font-semibold">Customer</th>
                <th className="p-3.5 font-semibold">Phone & Address</th>
                <th className="p-3.5 font-semibold text-right">Khata Balance</th>
                <th className="p-3.5 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">
                    No customers found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const hasBalance = customer.khataBalance > 0;
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="p-3.5">
                        <button
                          onClick={() => setActiveCustomer(customer)}
                          className="text-left group"
                        >
                          <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                            {customer.name}
                          </p>
                          <span className="text-[11px] text-emerald-600 font-medium group-hover:underline">
                            View Full Ledger History →
                          </span>
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <p className="font-mono text-xs">{customer.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {customer.address}
                        </p>
                      </td>
                      <td className="p-3.5 text-right">
                        {hasBalance ? (
                          <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">
                            {formatPKR(customer.khataBalance)}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center justify-end gap-1 ml-auto w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.khataClear}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenPayment(customer)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-semibold rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1"
                            title="Jama Karein"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Jama</span>
                          </button>
                          <button
                            onClick={() => handleOpenCredit(customer)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            title="Udhaar Likhein"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Udhaar</span>
                          </button>
                          {hasBalance && (
                            <button
                              onClick={() => handleCopyReminder(customer)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Copy SMS/WhatsApp Payment Reminder"
                            >
                              {copiedId === customer.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Full Ledger Drawer / Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Customer Khata Ledger (Khata Book)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeCustomer.phone} • {activeCustomer.address}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Current Balance
                  </span>
                  <span className="text-base font-bold text-amber-700">
                    {formatPKR(activeCustomer.khataBalance)}
                  </span>
                </div>
                <button
                  onClick={() => setActiveCustomer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick action bar inside ledger */}
            <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {customerEntries.length} recorded transactions
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPayment(activeCustomer)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-2xs"
                >
                  + Jama Payment
                </button>
                <button
                  onClick={() => handleOpenCredit(activeCustomer)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200"
                >
                  + Udhaar Entry
                </button>
              </div>
            </div>

            {/* Transaction entries */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
              {customerEntries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No previous ledger entries for this customer.
                </div>
              ) : (
                customerEntries.map((entry) => {
                  const isPayment = entry.type === 'payment';
                  return (
                    <div
                      key={entry.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPayment
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isPayment ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {entry.note || (isPayment ? 'Payment Received' : 'Udhaar Goods')}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateTime(entry.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            isPayment ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {isPayment ? '-' : '+'} {formatPKR(entry.amount)}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">
                          {isPayment ? 'Jama (Received)' : 'Udhaar (Credit)'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Record Payment (Jama) Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t.actionAddKhataPayment} (Jama Karein)
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Baqi: {formatPKR(c.khataBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Received Amount (Raqam Rs.)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 2000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note / Remarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash received at shop, or JazzCash"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Mehfooz Karein (Confirm Jama)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Credit (Udhaar) Modal */}
      {creditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Add Credit / Udhaar Entry
              </h3>
              <button
                onClick={() => setCreditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Baqi: {formatPKR(c.khataBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credit Amount (Udhaar Raqam Rs.)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 1500"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Items / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly household grocery rations"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Add to Khata (Confirm Udhaar)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
