import React from 'react';
import {
  Store,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT } from '../utils/translations';

export const SettingsView: React.FC = () => {
  const { profile, shop, language, setLanguage, resetToDemoData } = useApp();
  const t = useT(language);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.navSettings}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'en'
            ? 'Store identity, subscription plan, and system settings.'
            : 'Dukan ki maloomat, subscription plan aur zaroori settings.'}
        </p>
      </div>

      {/* Shop Profile & Identity */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Store className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Shop Identity & Location</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Shop Name
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
              {shop.name}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Shopkeeper Name
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900">
              {profile.fullName} ({profile.role})
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Store Phone / WhatsApp
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{shop.phone}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              City & Address
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{shop.address}, {shop.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription & Plan Status (PRD Section 8) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Plan & Subscription Status</h3>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
            Active Free Trial
          </span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-sm text-slate-900">
                Munshi AI Shopkeeper Standard
              </h4>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Includes unlimited POS counter sales, Khata ledger, automated inventory tracking, and reports.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>42 days remaining in your 2-month Free Trial</span>
            </div>
          </div>

          <button
            onClick={() => alert('Your trial is active! No payment required during the 60-day promotional trial.')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs shrink-0 transition-colors"
          >
            Manage Plan
          </button>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-slate-700">Included Features in your tier:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Unlimited Products & Inventory Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Real-time Customer Khata & Balances</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sales POS Counter with Receipt Printing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>English & Natural Roman Urdu Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Languages className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Language & Terminology (Zuban)</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-600">
              Choose your preferred interface language. Roman Urdu uses natural terms Pakistani shopkeepers understand (Naya Product, Baqi Raqam, Stock Kam Hai).
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-3 py-1.5 rounded transition-all ${
                language === 'ur'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو (Roman Urdu)
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Demo Data Reset</h3>
        <p className="text-xs text-slate-500">
          Reset all stored products, customers, sales bills, and khata entries back to the initial sample kiryana store (Madina General Store).
        </p>

        <button
          onClick={() => {
            if (window.confirm('Reset all store data to default sample values?')) {
              resetToDemoData();
              alert('Store data reset successfully!');
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default Demo Store</span>
        </button>
      </div>
    </div>
  );
};
