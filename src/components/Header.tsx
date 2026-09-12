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
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0"
    >
      {/* Title & Context */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {getTitle()}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <Calendar className="w-3 h-3 text-slate-400" />
          {todayStr}
        </span>
      </div>

      {/* Global Search Bar */}
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
            className="w-full pl-9 pr-10 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded absolute right-2.5 top-1/2 -translate-y-1/2 shadow-2xs pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-2.5">
        {/* Low Stock Notification Badge */}
        <button
          id="btn-notifications-inventory"
          onClick={() => setCurrentView('inventory')}
          title={`${lowStockCount} items need restock`}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Primary CTA: Record Sale / Nayi Sale */}
        <button
          id="header-btn-new-sale"
          onClick={() => setCurrentView('sales')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-xs shadow-emerald-700/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actionNewSale}</span>
        </button>
      </div>
    </header>
  );
};
