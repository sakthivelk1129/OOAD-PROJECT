import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Copy, CheckCircle, Percent, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { coupons, applyCoupon, appliedCoupon, navigate, showToast } = useApp();

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Code ${code} copied to clipboard!`);
  };

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      navigate('/cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <Tag className="w-6 h-6 text-orange-500" />
          <span>Exclusive Offers & Deals</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Save on every bite with discounts, cashback, and free delivery vouchers
        </p>
      </div>

      {/* Hero Offer Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Mega Food Fest</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Up to 50% OFF on Top Gourmet Kitchens
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-lg">
            Enjoy premium flavors from woodfired pizzas to royal dum biryanis with no minimum delivery fee on select offers.
          </p>
        </div>
        <button
          onClick={() => navigate('/restaurants')}
          className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-transform active:scale-95 shrink-0"
        >
          Explore Qualifying Kitchens
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code;

          return (
            <div
              key={coupon.code}
              className={`bg-white rounded-3xl border transition-all p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                isApplied ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      <Percent className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm text-zinc-900 tracking-tight">
                      {coupon.discountPercent}% OFF
                    </span>
                  </div>

                  <span className="font-mono font-bold text-xs bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200">
                    {coupon.code}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-900 mt-4">
                  {coupon.description}
                </h3>

                <div className="mt-2 text-xs text-zinc-500 space-y-1">
                  <p>• Max discount: ₹{coupon.maxDiscount}</p>
                  <p>• Minimum cart value: ₹{coupon.minOrder}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>Valid till {coupon.expiryDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {isApplied ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(coupon.code)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors"
                    >
                      Apply Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
