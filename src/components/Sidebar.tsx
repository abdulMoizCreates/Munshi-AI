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
      className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none shrink-0 transition-all duration-200"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shadow-emerald-700/20">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
                Munshi AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 leading-none">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5 max-w-[140px]">
              {shop.name}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {language === 'en' ? 'Main Menu' : 'Ahem Menu'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50/80 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-emerald-700' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Language Switcher, Demo Reset, & Profile */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {/* Language Switcher */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.switchLanguage}</span>
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-semibold">
            <button
              id="lang-switch-en"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              id="lang-switch-ur"
              onClick={() => setLanguage('ur')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'ur'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              اردو (Roman)
            </button>
          </div>
        </div>

        {/* Demo reset button */}
        <button
          id="btn-reset-demo"
          onClick={() => {
            if (window.confirm('Reset all data to default Kiryana sample store?')) {
              resetToDemoData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>

        {/* Shopkeeper Profile Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
            {profile.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {profile.fullName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="capitalize">{profile.role}</span>
            </div>
          </div>
          <Store className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
