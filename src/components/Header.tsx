import React, { useRef, useEffect } from 'react';
import { Search, Plus, Bell, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT } from '../utils/translations';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    searchQuery,
    setSearchQuery,
    products,
  } = useApp();
  const t = useT(language);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Low stock alert count
  const lowStockCount = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  ).length;

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return t.navDashboard;
      case 'sales':
        return t.navSales;
      case 'khata':
        return t.navKhata;
      case 'inventory':
        return t.navInventory;
      case 'products':
        return t.navProducts;
      case 'customers':
        return t.navCustomers;
      case 'orders':
        return t.navOrders;
      case 'offers':
        return t.navOffers;
      case 'reports':
        return t.navReports;
      case 'settings':
        return t.navSettings;
      default:
        return 'Munshi AI';
    }
  };

  const todayStr = new Date().toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header
      id="app-header"
      className="h-18 bg-[#0f172a] border-b border-[var(--line-soft)] px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0"
    >
      <div className="flex items-center gap-3 min-w-[200px]">
        <h1 className="text-[1.05rem] font-bold text-white tracking-tight">
          {getTitle()}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-[var(--line-soft)]">
          <Calendar className="w-3 h-3 text-slate-400" />
          {todayStr}
        </span>
      </div>

      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-10 py-2 bg-slate-800 hover:bg-slate-700 focus:bg-slate-700 border border-[var(--line-soft)] rounded-xl text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(52,211,153,0.18)] focus:border-[var(--accent)] transition-all"
          />
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-700 border border-[var(--line-soft)] rounded-md absolute right-2.5 top-1/2 -translate-y-1/2 shadow-sm pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          id="btn-notifications-inventory"
          onClick={() => setCurrentView('inventory')}
          title={`${lowStockCount} items need restock`}
          className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-[var(--line-soft)]"
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--amber)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          id="header-btn-new-sale"
          onClick={() => setCurrentView('sales')}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-xs md:text-sm font-semibold rounded-xl shadow-[0_12px_20px_rgba(31,122,90,0.2)] active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actionNewSale}</span>
        </button>
      </div>
    </header>
  );
};
