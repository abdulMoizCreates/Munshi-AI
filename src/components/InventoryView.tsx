import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Search,
  X,
  History,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT, formatDateTime } from '../utils/translations';
import { Product } from '../types';

export const InventoryView: React.FC = () => {
  const { products, stockMovements, adjustStock, language } = useApp();
  const t = useT(language);

  const [search, setSearch] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');

  // Modal State for stock adjustment
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'restock' | 'damage' | 'adjustment'>('restock');
  const [quantityInput, setQuantityInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const lowStockCount = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  ).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (filterLowStockOnly) {
      return matchesSearch && p.stockQuantity <= p.lowStockThreshold;
    }
    return matchesSearch;
  });

  const openAdjustModal = (p: Product, defaultType: 'restock' | 'damage' | 'adjustment' = 'restock') => {
    setSelectedProduct(p);
    setAdjustType(defaultType);
    setQuantityInput('');
    setNoteInput('');
    setAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const qty = parseInt(quantityInput);
    if (!qty || qty === 0) return;

    // restock is positive, damage is negative, adjustment can be either
    const finalQty = adjustType === 'damage' ? -Math.abs(qty) : qty;

    adjustStock(selectedProduct.id, adjustType, finalQty, noteInput || `${adjustType} update`);
    setAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Inventory Units
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {products.reduce((sum, p) => sum + p.stockQuantity, 0)}{' '}
            <span className="text-sm font-normal text-slate-500">items in shop</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {products.length} distinct product lines</p>
        </div>

        <div
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`p-5 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            lowStockCount > 0
              ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              {t.metricLowStock}
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700 tracking-tight">
            {lowStockCount} items
          </div>
          <p className="text-xs text-rose-600/80 mt-1">
            {filterLowStockOnly ? 'Showing low-stock items only (Click to show all)' : 'Click to filter low stock'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Stock Log History
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stockMovements.length} logs
          </div>
          <p className="text-xs text-slate-500 mt-1">Sales, wholesale restocks and adjustments</p>
        </div>
      </div>

      {/* Navigation tabs between Current Stock & Stock Movement Log */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'stock'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Stock Levels' : 'Maujooda Stock'}</span>
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'movements'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Movement Audit Log' : 'Stock Ki Tareekh'}</span>
            </button>
          </div>

          {activeTab === 'stock' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search inventory...' : 'Stock talash karein...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Current Stock Table */}
        {activeTab === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                  <th className="p-3.5 font-semibold">Product Name</th>
                  <th className="p-3.5 font-semibold">SKU / Code</th>
                  <th className="p-3.5 font-semibold text-center">Threshold Alert</th>
                  <th className="p-3.5 font-semibold text-right">Available Stock</th>
                  <th className="p-3.5 font-semibold text-center">Status</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity <= 0;
                  const isLowStock = p.stockQuantity <= p.lowStockThreshold;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                        <span className="text-[11px] text-slate-500">{p.category}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {p.sku}
                      </td>
                      <td className="p-3.5 text-center text-slate-600">
                        {p.lowStockThreshold} {p.unit}s
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        <span
                          className={`text-sm ${
                            isOutOfStock
                              ? 'text-rose-600'
                              : isLowStock
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {p.stockQuantity}
                        </span>{' '}
                        <span className="text-[11px] font-normal text-slate-400">
                          {p.unit}s
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Stock Kam Hai
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAdjustModal(p, 'restock')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-xs transition-colors"
                          >
                            + Restock
                          </button>
                          <button
                            onClick={() => openAdjustModal(p, 'adjustment')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded text-xs transition-colors"
                          >
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Stock Movement History Log */}
        {activeTab === 'movements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                  <th className="p-3.5 font-semibold">Date & Time</th>
                  <th className="p-3.5 font-semibold">Product</th>
                  <th className="p-3.5 font-semibold">Movement Type</th>
                  <th className="p-3.5 font-semibold text-center">Change Qty</th>
                  <th className="p-3.5 font-semibold text-right">Balance Stock</th>
                  <th className="p-3.5 font-semibold">Remarks / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((sm) => (
                  <tr key={sm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 text-slate-500 font-mono">
                      {formatDateTime(sm.createdAt)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {sm.productName}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`capitalize px-2 py-0.5 rounded text-[11px] font-semibold ${
                          sm.type === 'restock'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sm.type === 'sale'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {sm.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold">
                      <span
                        className={sm.quantity > 0 ? 'text-emerald-700' : 'text-rose-600'}
                      >
                        {sm.quantity > 0 ? `+${sm.quantity}` : sm.quantity}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-700">
                      {sm.previousStock} → <span className="font-bold">{sm.newStock}</span>
                    </td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate">
                      {sm.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Stock Adjustment ({selectedProduct.name})
              </h3>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 pt-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between">
                <span className="text-slate-500">Current Stock Quantity:</span>
                <span className="font-bold text-slate-900">
                  {selectedProduct.stockQuantity} {selectedProduct.unit}s
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Adjustment Reason
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('restock')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold border ${
                      adjustType === 'restock'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Wholesale Restock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('damage')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold border ${
                      adjustType === 'damage'
                        ? 'bg-rose-50 text-rose-800 border-rose-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Damage / Waste
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold border ${
                      adjustType === 'adjustment'
                        ? 'bg-blue-50 text-blue-800 border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Physical Audit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity ({selectedProduct.unit}s)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note / Supplier / Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purchased 2 cartons from Akbari Mandi"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Update Stock (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
