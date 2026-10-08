import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import {
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    currentUser,
    cart,
    cartRestaurant,
    cartCalculations,
    placeOrder,
    navigate,
    addSavedAddress,
  } = useApp();

  // Selected address state
  const savedAddresses = currentUser.savedAddresses || [];
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr ? defaultAddr.id : '');

  // Add new address modal / inline state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Metro City');
  const [newAddrPincode, setNewAddrPincode] = useState('94103');
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState(currentUser.paymentPreferences?.savedUpiId || 'alex@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4891');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardHolder, setCardHolder] = useState(currentUser.name);

  // Loading simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Verifying order...');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrArea.trim()) return;
    addSavedAddress({
      type: newAddrType,
      street: newAddrStreet,
      area: newAddrArea,
      city: newAddrCity,
      pincode: newAddrPincode,
      isDefault: true,
    });
    setShowAddAddress(false);
    setNewAddrStreet('');
    setNewAddrArea('');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Securing payment gateway...');

    setTimeout(() => {
      setProcessingStatus(`Confirming order with ${cartRestaurant?.name || 'Kitchen'}...`);
      setTimeout(() => {
        setProcessingStatus('Generating order tracking details...');
        setTimeout(() => {
          const placedOrder = placeOrder({
            address: selectedAddress,
            paymentMethod,
          });
          setIsProcessing(false);
          navigate(`/order-success/${placedOrder.id}`);
        }, 600);
      }, 700);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Review your delivery details and choose your preferred payment option
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-zinc-900">Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleCreateAddress} className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3">
                <p className="text-xs font-bold text-zinc-800">Add New Delivery Location</p>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewAddrType(t)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        newAddrType === t
                          ? 'bg-zinc-900 text-white'
                          : 'bg-white border border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="House / Flat / Street address"
                  required
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Locality / Area"
                    required
                    value={newAddrArea}
                    onChange={(e) => setNewAddrArea(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Postal PIN Code"
                    required
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-2 rounded-xl transition-colors"
                >
                  Save Address & Deliver Here
                </button>
              </form>
            )}

            {/* Saved Addresses Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {addr.type === 'Home' ? (
                          <Home className="w-3.5 h-3.5 text-zinc-500" />
                        ) : addr.type === 'Work' ? (
                          <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                        <span className="font-bold text-xs text-zinc-900">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-1.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500' : 'border-zinc-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                      {addr.street}, {addr.area}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {addr.city} - {addr.pincode}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-base text-zinc-900">Payment Option</h3>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-orange-500" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-orange-500" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {/* Simulated Payment Method Inputs */}
            {paymentMethod === 'upi' && (
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Instant UPI Payment</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Fastest & Secure</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-zinc-400">Supported:</span>
                  <span className="text-[11px] font-semibold text-zinc-600">Google Pay · PhonePe · Paytm · BHIM</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Credit or Debit Card</span>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[11px]">256-Bit SSL Encrypted</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Cardholder Name"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span>Pay Cash upon Food Arrival</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Please keep exact change ready of <strong className="font-bold tabular-nums">₹{cartCalculations.total}</strong> to help our delivery rider complete contactless delivery swiftly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
              Order Summary ({cartCalculations.itemCount} items)
            </h3>

            {/* Restaurant Mini Header */}
            <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-zinc-900">{cartRestaurant?.name}</p>
                <p className="text-xs text-zinc-500">{cartRestaurant?.area}</p>
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                ~{cartRestaurant?.deliveryTimeMinutes || 25} mins
              </span>
            </div>

            {/* Items mini list */}
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-zinc-100 pr-1 text-xs">
              {cart.map((it) => (
                <div key={it.foodItemId} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 tabular-nums">{it.quantity}x</span>
                    <span className="text-zinc-700 line-clamp-1">{it.name}</span>
                  </div>
                  <span className="tabular-nums font-semibold text-zinc-900">
                    ₹{it.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-zinc-800">₹{cartCalculations.subtotal}</span>
              </div>
              {cartCalculations.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span className="tabular-nums">-₹{cartCalculations.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="tabular-nums text-zinc-800">₹{cartCalculations.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform & Taxes</span>
                <span className="tabular-nums text-zinc-800">₹{cartCalculations.platformFee + cartCalculations.taxes}</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline text-zinc-900 font-bold">
                <span className="text-sm">Total Payable</span>
                <span className="text-xl font-extrabold text-orange-600 tabular-nums">
                  ₹{cartCalculations.total}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStatus}</span>
                </>
              ) : (
                <>
                  <span>Place Order · ₹{cartCalculations.total}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Encrypted 100% Guaranteed Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
