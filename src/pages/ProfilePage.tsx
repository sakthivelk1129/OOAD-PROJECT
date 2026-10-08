import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  CreditCard,
  Heart,
  ShoppingBag,
  Home,
  Briefcase,
  Building,
  Save,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    navigate,
    favoriteRestaurantIds,
    orders,
  } = useApp();

  // Profile Edit State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [upiId, setUpiId] = useState(currentUser.paymentPreferences?.savedUpiId || '');

  // Add Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('Metro City');
  const [newPincode, setNewPincode] = useState('94103');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      paymentPreferences: {
        preferredMethod: currentUser.paymentPreferences?.preferredMethod || 'upi',
        savedUpiId: upiId,
      },
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim()) return;
    const addresses = currentUser.savedAddresses || [];
    addSavedAddress({
      type: newType,
      street: newStreet,
      area: newArea,
      city: newCity,
      pincode: newPincode,
      isDefault: addresses.length === 0,
    });
    setShowAddAddress(false);
    setNewStreet('');
    setNewArea('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Manage your contact info, saved addresses, and payment preferences
        </p>
      </div>

      {/* Quick Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="bg-white rounded-2xl border border-zinc-200/80 p-4 text-left hover:border-orange-300 transition-colors shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-xs text-zinc-500">Total Orders</span>
          <p className="text-xl font-extrabold text-zinc-900 mt-0.5 tabular-nums">
            {orders.length}
          </p>
        </button>

        <button
          onClick={() => navigate('/favorites')}
          className="bg-white rounded-2xl border border-zinc-200/80 p-4 text-left hover:border-rose-300 transition-colors shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Heart className="w-4 h-4" />
          </div>
          <span className="text-xs text-zinc-500">Favorite Kitchens</span>
          <p className="text-xl font-extrabold text-zinc-900 mt-0.5 tabular-nums">
            {favoriteRestaurantIds.length}
          </p>
        </button>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 text-left shadow-xs col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs text-zinc-500">Account Standing</span>
          <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
            Verified Customer
          </p>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-zinc-900">Personal Details</h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Default UPI ID (Optional)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@okhdfcbank"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-zinc-900">Saved Addresses</h3>
            <p className="text-xs text-zinc-500">Delivery locations for fast 1-click checkout</p>
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
          <form onSubmit={handleAddAddress} className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3">
            <p className="text-xs font-bold text-zinc-800">Add New Address</p>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    newType === t ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="House, Flat or Street Address"
              required
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Locality / Area"
                required
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="PIN Code"
                required
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-2 rounded-xl transition-colors"
            >
              Add This Address
            </button>
          </form>
        )}

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(currentUser.savedAddresses || []).map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl border transition-all ${
                addr.isDefault ? 'border-orange-400 bg-orange-50/20' : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
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
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 mr-1"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteSavedAddress(addr.id)}
                    className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-700 leading-relaxed">
                {addr.street}, {addr.area}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                {addr.city} - {addr.pincode}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
