import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant, Coupon, OrderStatus } from '../types';
import {
  Shield,
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Bike,
  AlertTriangle,
  BarChart3,
  Percent,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    toggleUserStatus,
    restaurants,
    updateRestaurant,
    addRestaurant,
    foodItems,
    toggleFoodAvailability,
    orders,
    coupons,
    addCoupon,
    deleteCoupon,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'restaurants' | 'orders' | 'food' | 'coupons'
  >('overview');

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  // Create Coupon Modal State
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(25);
  const [newMaxDisc, setNewMaxDisc] = useState(150);
  const [newMinOrder, setNewMinOrder] = useState(299);
  const [newDesc, setNewDesc] = useState('');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  // Create Restaurant State
  const [showAddRest, setShowAddRest] = useState(false);
  const [restName, setRestName] = useState('');
  const [restTagline, setRestTagline] = useState('');
  const [restCuisine, setRestCuisine] = useState('North Indian, Thali');
  const [restAddress, setRestAddress] = useState('Metro City Central');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    addCoupon({
      code: newCode.toUpperCase(),
      discountPercent: newDiscount,
      maxDiscount: newMaxDisc,
      minOrder: newMinOrder,
      description: newDesc || `Flat ${newDiscount}% OFF on food orders`,
      expiryDate: newExpiry,
      isActive: true,
    });
    setShowAddCoupon(false);
    setNewCode('');
    setNewDesc('');
  };

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName.trim()) return;
    addRestaurant({
      name: restName,
      slug: restName.toLowerCase().replace(/\s+/g, '-'),
      tagLine: restTagline || 'Authentic fresh meals & appetizers',
      cuisine: restCuisine.split(',').map((c) => c.trim()),
      rating: 4.8,
      ratingCount: 1,
      deliveryTimeMinutes: 25,
      deliveryFee: 25,
      minOrder: 150,
      priceLevel: '₹₹',
      heroImage: restaurants[0]?.heroImage || '',
      address: restAddress,
      area: 'Central Metro',
      city: 'Metro City',
      isOpen: true,
      status: 'approved',
    });
    setShowAddRest(false);
    setRestName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Title & Role Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>QuickBite Platform Central Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Platform Operations Console
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time oversight for users, kitchens, delivery fleets, orders, and promotion codes
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'restaurants' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Kitchens ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'food' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Food Catalog ({foodItems.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Users & Fleet ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coupons' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Revenue (Gross)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            ₹{totalRevenue}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">From {orders.length} orders total</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Active Orders In Flight</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-orange-600 font-medium mt-0.5">Live tracking active</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Partner Restaurants</span>
            <Store className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {restaurants.length}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {restaurants.filter((r) => r.isOpen).length} currently active
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Delivered Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2 tabular-nums">
            {orders.length > 0
              ? `${Math.round((completedOrders.length / Math.max(1, orders.length)) * 100)}%`
              : '100%'}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">{completedOrders.length} fulfilled</p>
        </div>
      </div>

      {/* OVERVIEW TAB: ANALYTICAL VISUAL CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SVG Orders & Revenue Trend Chart */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-zinc-900">Weekly Orders Trend</h3>
                  <p className="text-xs text-zinc-400">Fulfilled order volume across 7 days</p>
                </div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  +18.4% WoW
                </div>
              </div>

              {/* Clean SVG Bar Chart */}
              <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { day: 'Mon', count: 42, height: '45%' },
                  { day: 'Tue', count: 56, height: '60%' },
                  { day: 'Wed', count: 68, height: '72%' },
                  { day: 'Thu', count: 62, height: '66%' },
                  { day: 'Fri', count: 88, height: '94%' },
                  { day: 'Sat', count: 94, height: '100%' },
                  { day: 'Sun', count: 85, height: '90%' },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {item.count}
                    </span>
                    <div
                      style={{ height: item.height }}
                      className="w-full bg-orange-500 rounded-t-xl group-hover:bg-orange-600 transition-all shadow-xs"
                    />
                    <span className="text-[11px] font-semibold text-zinc-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cuisines Breakdown */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-zinc-900">Cuisine Market Share</h3>
              <p className="text-xs text-zinc-400">Popular food categories ordered by customers</p>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Biryani & Mughlai', percent: 38, color: 'bg-orange-500' },
                  { name: 'Woodfired Pizza & Italian', percent: 28, color: 'bg-amber-500' },
                  { name: 'South Indian & Tiffin', percent: 18, color: 'bg-emerald-500' },
                  { name: 'Fast Food Burgers & Sides', percent: 10, color: 'bg-indigo-500' },
                  { name: 'Desserts & Beverages', percent: 6, color: 'bg-rose-500' },
                ].map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-zinc-800">
                      <span>{cat.name}</span>
                      <span className="tabular-nums font-bold">{cat.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        style={{ width: `${cat.percent}%` }}
                        className={`h-full ${cat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900">All Platform Orders ({orders.length})</h3>
            <span className="text-xs text-zinc-400">Live order streams</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Courier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900">#{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800">{ord.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-800">{ord.restaurantName}</td>
                    <td className="py-3 px-4 text-zinc-600">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-black tabular-nums text-zinc-900">₹{ord.total}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {ord.deliveryPartnerName || 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESTAURANTS TAB */}
      {activeTab === 'restaurants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900">Restaurants ({restaurants.length})</h3>
            <button
              onClick={() => setShowAddRest(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Restaurant</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Cuisine</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {restaurants.map((rest) => (
                    <tr key={rest.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900">{rest.name}</td>
                      <td className="py-3 px-4 text-zinc-600">{rest.cuisine.join(', ')}</td>
                      <td className="py-3 px-4 text-zinc-500">{rest.area}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">★ {rest.rating}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rest.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {rest.isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => updateRestaurant(rest.id, { isOpen: !rest.isOpen })}
                          className="text-[11px] font-semibold text-orange-600 hover:underline"
                        >
                          {rest.isOpen ? 'Mark Closed' : 'Mark Open'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FOOD CATALOG TAB */}
      {activeTab === 'food' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900">Food Items ({foodItems.length})</h3>
            <span className="text-xs text-zinc-400">Manage menu inventory</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {foodItems.map((f) => {
                  const rest = restaurants.find((r) => r.id === f.restaurantId);
                  return (
                    <tr key={f.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900">{f.name}</td>
                      <td className="py-3 px-4 text-zinc-600">{rest?.name || 'Kitchen'}</td>
                      <td className="py-3 px-4 font-bold tabular-nums text-zinc-900">₹{f.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.isVeg ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {f.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-200 text-zinc-600'}`}>
                          {f.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleFoodAvailability(f.id)}
                          className="text-[11px] font-semibold text-orange-600 hover:underline"
                        >
                          Toggle Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS & FLEET TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900">Registered Accounts & Fleet ({users.length})</h3>
            <span className="text-xs text-zinc-400">User account lifecycle</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900">{u.name}</td>
                    <td className="py-3 px-4 text-zinc-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{u.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'suspended' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {u.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`text-[11px] font-semibold hover:underline ${
                          u.status === 'suspended' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900">Active Coupons ({coupons.length})</h3>
            <button
              onClick={() => setShowAddCoupon(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="font-extrabold text-sm text-zinc-900">{c.discountPercent}% OFF</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-800 mt-2">{c.description}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Min order: ₹{c.minOrder} · Max cap: ₹{c.maxDiscount}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">Valid: {c.expiryDate}</span>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUPERBOWL40"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaxDisc}
                    onChange={(e) => setNewMaxDisc(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40% OFF up to ₹150 on feast combos"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Register New Restaurant</h3>
            <form onSubmit={handleCreateRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo Ramen House"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Slow simmered tonkotsu broth & handmade noodles"
                  value={restTagline}
                  onChange={(e) => setRestTagline(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Cuisines (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Japanese, Asian, Noodles"
                  value={restCuisine}
                  onChange={(e) => setRestCuisine(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="14 Sakura Lane, Metro City"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRest(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                >
                  Register Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
