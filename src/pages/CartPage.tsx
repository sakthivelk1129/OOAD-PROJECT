import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartRestaurant,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartCalculations,
    coupons,
    navigate,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [cookingInstructions, setCookingInstructions] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5 pb-32">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Looks like you haven&apos;t added any delicious food yet. Explore local kitchens and satisfy your cravings!
          </p>
        </div>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-transform active:scale-95 shadow-md shadow-orange-500/20"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Your Food Cart</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ordering from <span className="font-bold text-zinc-800">{cartRestaurant?.name}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
              Items in Order ({cartCalculations.itemCount})
            </h3>

            <div className="divide-y divide-zinc-100">
              {cart.map((item) => (
                <div key={item.foodItemId} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Veg/Non-veg indicator */}
                    <div
                      className={`w-3.5 h-3.5 border-2 rounded-[2px] flex items-center justify-center p-[2px] shrink-0 ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-700'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-700'}`} />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{item.name}</h4>
                      <p className="text-xs text-zinc-500 tabular-nums">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Total */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-100 rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.foodItemId, -1)}
                        className="p-1 hover:text-orange-600 transition-colors"
                        title="Reduce"
                      >
                        <Minus className="w-3 h-3 text-zinc-600" />
                      </button>
                      <span className="text-xs font-bold tabular-nums px-2.5 text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.foodItemId, 1)}
                        className="p-1 hover:text-orange-600 transition-colors"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3 text-zinc-600" />
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-zinc-900 tabular-nums min-w-[60px] text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.foodItemId)}
                      className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Instructions note */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
            <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
              Cooking / Delivery Notes for Kitchen:
            </label>
            <input
              type="text"
              placeholder="e.g., Less spicy, no onions, extra napkins please..."
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Available Coupons Suggestions */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Available Promotional Codes</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coupons.filter((c) => c.isActive).map((c) => {
                const isApplicable = cartCalculations.subtotal >= c.minOrder;
                const isThisApplied = appliedCoupon?.code === c.code;

                return (
                  <div
                    key={c.code}
                    className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                      isThisApplied
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : isApplicable
                        ? 'border-zinc-200 bg-zinc-50/60 hover:border-orange-300'
                        : 'border-zinc-100 bg-zinc-50/20 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded text-[11px]">
                          {c.code}
                        </span>
                        {isThisApplied && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 font-semibold text-zinc-800 text-[11px] leading-tight">
                        {c.description}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Min. order ₹{c.minOrder}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-200/50 flex justify-end">
                      {isThisApplied ? (
                        <button
                          onClick={removeCoupon}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          disabled={!isApplicable}
                          onClick={() => applyCoupon(c.code)}
                          className={`text-[11px] font-bold ${
                            isApplicable
                              ? 'text-orange-600 hover:underline'
                              : 'text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          {isApplicable ? 'Apply Code' : `Add ₹${c.minOrder - cartCalculations.subtotal} more`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Coupon Input & Bill Breakdown & Checkout CTA */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          {/* Coupon Input Box */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-mono font-bold text-emerald-900 text-xs">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      Savings of ₹{cartCalculations.discount} applied!
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="tabular-nums font-semibold text-zinc-800">
                  ₹{cartCalculations.subtotal}
                </span>
              </div>

              {cartCalculations.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums">-₹{cartCalculations.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="tabular-nums text-zinc-800">
                  ₹{cartCalculations.deliveryFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span className="tabular-nums text-zinc-800">₹{cartCalculations.platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Govt. Taxes & GST (5%)</span>
                <span className="tabular-nums text-zinc-800">₹{cartCalculations.taxes}</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline text-zinc-900">
                <span className="font-extrabold text-sm">To Pay</span>
                <span className="font-black text-xl text-orange-600 tabular-nums">
                  ₹{cartCalculations.total}
                </span>
              </div>
            </div>

            {/* Estimated Delivery Time info */}
            <div className="bg-zinc-50 rounded-xl p-3 flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Delivered in ~{cartRestaurant?.deliveryTimeMinutes || 25} mins at your door</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
