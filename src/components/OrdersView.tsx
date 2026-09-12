import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  PackageCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT, formatPKR, formatDateTime } from '../utils/translations';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, customers, products, createOrder, updateOrderStatus, language } = useApp();
  const t = useT(language);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Order Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('0300-');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 },
  ]);
  const [orderNotes, setOrderNotes] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    const customerName = customer ? customer.name : manualCustomerName || 'Walk-in Phone Order';
    const customerPhone = customer ? customer.phone : manualCustomerPhone;

    let totalAmount = 0;
    const items = orderItems.map((oi) => {
      const p = products.find((prod) => prod.id === oi.productId);
      const unitPrice = p ? p.sellingPrice : 0;
      const subtotal = unitPrice * oi.quantity;
      totalAmount += subtotal;
      return {
        productId: oi.productId,
        productName: p ? p.name : 'Unknown item',
        quantity: oi.quantity,
        unitPrice,
        subtotal,
      };
    });

    createOrder({
      customerId: selectedCustomerId || undefined,
      customerName,
      customerPhone,
      items,
      status: 'pending',
      totalAmount,
      notes: orderNotes,
    });

    setIsModalOpen(false);
    setOrderItems([{ productId: products[0]?.id || '', quantity: 1 }]);
    setOrderNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.navOrders} ({orders.length} orders)
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'en'
              ? 'Phone orders, home deliveries, and pickup packing lists.'
              : 'Gahakon ke phone orders, home delivery aur packing ke ahem orders.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.actionNewOrder}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search order # or customer...' : 'Order number ya gahak talash karein...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['all', 'pending', 'ready', 'delivered', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="p-3.5 font-semibold">Order #</th>
                <th className="p-3.5 font-semibold">Customer & Phone</th>
                <th className="p-3.5 font-semibold">Items Summary</th>
                <th className="p-3.5 font-semibold text-right">Total</th>
                <th className="p-3.5 font-semibold text-center">Status</th>
                <th className="p-3.5 font-semibold text-right">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      {order.orderNumber}
                      <span className="block font-sans font-normal text-[10px] text-slate-400">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {order.customerPhone}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="max-w-xs text-[11px] text-slate-700">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="block truncate">
                            {it.quantity}x {it.productName}
                          </span>
                        ))}
                      </div>
                      {order.notes && (
                        <p className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                          Note: {order.notes}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatPKR(order.totalAmount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'ready'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.status === 'ready' && <PackageCheck className="w-3 h-3" />}
                        {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                        {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as Order['status'])
                        }
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Create New Customer Order
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Customer (or choose Walk-in)
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="">Manual / Phone Order</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedCustomerId && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asif Sahab"
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0300-..."
                      value={manualCustomerPhone}
                      onChange={(e) => setManualCustomerPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Order Items Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Ordered Products
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {formatPKR(p.sellingPrice)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                      />
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery / Packing Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deliver after Maghrib prayer"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
