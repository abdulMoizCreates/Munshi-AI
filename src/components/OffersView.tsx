import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, XCircle, Calendar, Percent, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useT } from '../utils/translations';

export const OffersView: React.FC = () => {
  const { offers, addOffer, toggleOfferActive, language } = useApp();
  const t = useT(language);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(formData.discountValue) || 0;
    addOffer({
      title: formData.title,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: val,
      startAt: formData.startAt,
      endAt: formData.endAt,
      active: true,
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startAt: new Date().toISOString().split('T')[0],
      endAt: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.navOffers} ({offers.length} offers)
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'en'
              ? 'Promotions, weekend combos, and special discounts for loyal customers.'
              : 'Dukan ki offers, discount bundles aur gahakon ke liye deals.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion / Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white border rounded-xl p-5 shadow-2xs flex flex-col justify-between transition-all ${
              offer.active ? 'border-emerald-200/80' : 'border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    offer.discountType === 'percentage'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Percent className="w-3 h-3" />
                  {offer.discountType === 'percentage'
                    ? `${offer.discountValue}% OFF`
                    : `Flat Rs. ${offer.discountValue} OFF`}
                </span>

                <button
                  onClick={() => toggleOfferActive(offer.id)}
                  className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                    offer.active
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-slate-500 bg-slate-50 border-slate-200'
                  }`}
                >
                  {offer.active ? (
                    <>
                      <CheckCircle className="w-3 h-3" /> Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" /> Inactive
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{offer.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{offer.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Valid: {offer.startAt} to {offer.endAt}
              </span>
              <span className="font-semibold text-slate-600">
                {offer.active ? 'Visible at Checkout' : 'Paused'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Create New Offer</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Chai & Biscuit Combo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10% discount on purchasing 2 packs of tea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Value ({formData.discountType === 'percentage' ? '%' : 'Rs.'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 10"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startAt}
                    onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endAt}
                    onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
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
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
