import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  Printer,
  Receipt,
  AlertCircle,
  Banknote,
  BookOpen,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT, formatPKR, formatDateTime } from '../utils/translations';
import { Sale } from '../types';

export const SalesView: React.FC = () => {
  const { products, customers, recordSale, language } = useApp();
  const t = useT(language);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart state: { [productId]: quantity }
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'khata' | 'digital'>('cash');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Filtered product catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Cart operations
  const addToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const currentQty = cart[productId] || 0;
    if (currentQty >= prod.stockQuantity) {
      setErrorMessage(`Only ${prod.stockQuantity} ${prod.unit}s available in stock!`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const deleteFromCart = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
    setSelectedCustomerId('');
    setPaymentMethod('cash');
    setErrorMessage('');
  };

  // Cart totals
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)!;
    return {
      product,
      quantity,
      subtotal: product ? product.sellingPrice * quantity : 0,
    };
  }).filter(item => Boolean(item.product));

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Complete sale handler
  const handleCompleteSale = () => {
    if (cartItems.length === 0) return;

    if (paymentMethod === 'khata' && !selectedCustomerId) {
      setErrorMessage('Please select a customer for Khata (Udhaar) sale.');
      return;
    }

    const saleItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const sale = recordSale({
      customerId: selectedCustomerId || undefined,
      items: saleItems,
      paymentMethod,
    });

    setCompletedSale(sale);
    setCart({});
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-6 pb-6">
      {/* Left side: Product Catalog & Fast Search */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Search & Category Filter Header */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by item name or SKU...' : 'Product ka naam ya barcode likhein...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat === 'all' ? (language === 'en' ? 'All Items' : 'Sab Products') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
          {filteredProducts.map((prod) => {
            const inCart = cart[prod.id] || 0;
            const isOutOfStock = prod.stockQuantity <= 0;
            const isLowStock = prod.stockQuantity <= prod.lowStockThreshold;

            return (
              <div
                key={prod.id}
                onClick={() => !isOutOfStock && addToCart(prod.id)}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all select-none ${
                  isOutOfStock
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-200/80 hover:border-emerald-500/80 hover:shadow-xs cursor-pointer active:scale-[0.98]'
                } ${inCart > 0 ? 'ring-2 ring-emerald-500/20 border-emerald-500' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      {prod.sku}
                    </span>
                    {isOutOfStock ? (
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        Low: {prod.stockQuantity}
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-500">
                        {prod.stockQuantity} {prod.unit}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                    {prod.name}
                  </h4>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-emerald-700">
                    {formatPKR(prod.sellingPrice)}
                  </span>
                  {inCart > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {inCart}
                    </span>
                  ) : (
                    <div className="w-5 h-5 rounded bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-emerald-50">
                      <Plus className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Active Cart, Customer Selection, and Checkout */}
      <div className="w-full lg:w-96 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {language === 'en' ? 'Counter Register' : 'Counter Bill'}
            </h3>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            {t.customer}
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Cash Walk-in (Naqad Gahak)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.khataBalance > 0 ? `(Khata: ${formatPKR(c.khataBalance)})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Receipt className="w-8 h-8 stroke-1 mb-2 text-slate-300" />
              <p className="text-xs">{t.cartEmpty}</p>
            </div>
          ) : (
            cartItems.map(({ product, quantity, subtotal }) => (
              <div key={product.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatPKR(product.sellingPrice)} × {quantity}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteFromCart(product.id)}
                    className="w-6 h-6 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center ml-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right w-16 shrink-0">
                  <span className="text-xs font-bold text-slate-900">
                    {formatPKR(subtotal)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-4 mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Payment Method Selector & Checkout Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5">
              Payment Mode
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                    : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Naqad</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('khata')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'khata'
                    ? 'bg-white text-amber-800 border-amber-600 shadow-2xs'
                    : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Udhaar</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('digital')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'digital'
                    ? 'bg-white text-blue-800 border-blue-600 shadow-2xs'
                    : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Online</span>
              </button>
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Items Total ({cartItems.length})</span>
              <span>{formatPKR(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-1">
              <span>{t.total}</span>
              <span className="text-emerald-700">{formatPKR(totalAmount)}</span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            id="btn-complete-sale"
            disabled={cartItems.length === 0}
            onClick={handleCompleteSale}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg shadow-xs shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{t.checkout}</span>
          </button>
        </div>
      </div>

      {/* Sale Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sale Recorded Successfully</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{completedSale.invoiceNumber}</p>
            </div>

            {/* Receipt Summary */}
            <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">{completedSale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="font-semibold text-slate-800">{formatDateTime(completedSale.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold capitalize text-slate-800">{completedSale.paymentMethod}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                <span>Total Amount:</span>
                <span className="text-emerald-700">{formatPKR(completedSale.totalAmount)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printReceipt}</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>New Sale (Agli Sale)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
