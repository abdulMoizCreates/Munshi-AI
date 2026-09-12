import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Package,
  Boxes,
  Users,
  ClipboardList,
  Tag,
  BarChart3,
  Settings,
  Store,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT } from '../utils/translations';
import { ViewType } from '../types';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, language, setLanguage, shop, profile, resetToDemoData } = useApp();
  const t = useT(language);

  const navItems: { id: ViewType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'sales', label: t.navSales, icon: ShoppingCart },
    { id: 'khata', label: t.navKhata, icon: BookOpen },
    { id: 'inventory', label: t.navInventory, icon: Boxes },
    { id: 'products', label: t.navProducts, icon: Package },
    { id: 'customers', label: t.navCustomers, icon: Users },
    { id: 'orders', label: t.navOrders, icon: ClipboardList },
    { id: 'offers', label: t.navOffers, icon: Tag },
    { id: 'reports', label: t.navReports, icon: BarChart3 },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-[#0f172a] border-r border-[var(--line-soft)] flex flex-col h-screen select-none shrink-0 transition-all duration-200"
    >
      <div className="p-4 border-b border-[var(--line-soft)] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-[#0b1220] flex items-center justify-center font-bold text-base shadow-[0_8px_18px_rgba(52,211,153,0.22)]">
            M
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white tracking-tight text-base leading-none">
              Munshi AI
            </div>
            <p className="text-xs text-slate-300 font-medium truncate mt-1.5 max-w-[150px]">
              {shop.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-[inset_0_0_0_1px_rgba(52,211,153,0.12)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[var(--accent)]' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-[var(--line-soft)] space-y-2 bg-[#0f172a]">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900 border border-[var(--line-soft)] text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.switchLanguage}</span>
          </div>
          <div className="flex bg-slate-800 p-0.5 rounded-md text-[11px] font-semibold">
            <button
              id="lang-switch-en"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'en'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              id="lang-switch-ur"
              onClick={() => setLanguage('ur')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'ur'
                  ? 'bg-slate-700 text-[var(--accent)] shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        <button
          id="btn-reset-demo"
          onClick={() => {
            if (window.confirm('Reset all data to default Kiryana sample store?')) {
              resetToDemoData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-white py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-[var(--line-soft)]">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-[var(--line-soft)] flex items-center justify-center text-white font-semibold text-xs">
            {profile.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {profile.fullName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              <span className="capitalize">{profile.role}</span>
            </div>
          </div>
          <Store className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
