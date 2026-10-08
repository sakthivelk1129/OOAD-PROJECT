import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem, OrderStatus } from '../types';
import {
  ChefHat,
  TrendingUp,
  ShoppingBag,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Store,
  FastForward,
} from 'lucide-react';

export const RestaurantDashboard: React.FC = () => {
  const {
    currentUser,
    restaurants,
    foodItems,
    orders,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleFoodAvailability,
    updateOrderStatus,
    updateRestaurant,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'profile'>('orders');

  // Find restaurant managed by this user (or fallback to Bella Napoli or first rest)
  const currentRestId = currentUser.restaurantId || 'rest-2';
  const restaurant = restaurants.find((r) => r.id === currentRestId) || restaurants[0];

  // Orders for this restaurant
  const restOrders = orders.filter((o) => o.restaurantId === restaurant.id);
  const pendingOrders = restOrders.filter((o) => ['placed', 'confirmed', 'preparing', 'ready_for_pickup'].includes(o.status));
  const completedOrders = restOrders.filter((o) => o.status === 'delivered');

  // Stats
  const todayRevenue = restOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0);

  // Menu items for this restaurant
  const menuList = foodItems.filter((f) => f.restaurantId === restaurant.id);

  // Add / Edit Food Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(199);
  const [category, setCategory] = useState('Pizza');
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState(15);
  const [isBestseller, setIsBestseller] = useState(false);

  // Profile Edit State
  const [restName, setRestName] = useState(restaurant.name);
  const [restTagline, setRestTagline] = useState(restaurant.tagLine);
  const [restAddress, setRestAddress] = useState(restaurant.address);
  const [deliveryFee, setDeliveryFee] = useState(restaurant.deliveryFee);
  const [deliveryTime, setDeliveryTime] = useState(restaurant.deliveryTimeMinutes);
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);

  const openAddModal = () => {
    setEditingItemId(null);
    setName('');
    setDesc('');
    setPrice(199);
    setCategory(restaurant.cuisine[0] || 'Mains');
    setIsVeg(true);
    setPrepTime(15);
    setIsBestseller(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItemId(item.id);
    setName(item.name);
    setDesc(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setIsVeg(item.isVeg);
    setPrepTime(item.prepTimeMinutes);
    setIsBestseller(!!item.isBestSeller);
    setIsModalOpen(true);
  };

  const handleSaveFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItemId) {
      updateFoodItem(editingItemId, {
        name,
        description: desc,
        price,
        category,
        isVeg,
        prepTimeMinutes: prepTime,
        isBestSeller: isBestseller,
      });
    } else {
      addFoodItem({
        restaurantId: restaurant.id,
        name,
        description: desc,
        price,
        category,
        isVeg,
        prepTimeMinutes: prepTime,
        isBestSeller: isBestseller,
        isAvailable: true,
        rating: 4.8,
        ratingCount: 1,
        image: restaurant.heroImage,
      });
    }
    setIsModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant(restaurant.id, {
      name: restName,
      tagLine: restTagline,
      address: restAddress,
      deliveryFee,
      deliveryTimeMinutes: deliveryTime,
      isOpen,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Restaurant Kitchen Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            {restaurant.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {restaurant.address} · {restaurant.cuisine.join(', ')} · Status:{' '}
            <span className={restaurant.isOpen ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {restaurant.isOpen ? 'Accepting Orders' : 'Kitchen Closed'}
            </span>
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Live Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Menu Management ({menuList.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Kitchen Settings
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Today&apos;s Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            ₹{todayRevenue}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">From {restOrders.length} orders total</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Pending In-Kitchen</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Requires chef action</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {completedOrders.length}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Delivered safely</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Menu Offerings</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {menuList.length}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {menuList.filter((m) => m.isAvailable).length} Available online
          </p>
        </div>
      </div>

      {/* TAB 1: LIVE ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Live Kitchen Queue</h2>
            <span className="text-xs text-zinc-400">Real-time status synchronizer</span>
          </div>

          {restOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 max-w-md mx-auto space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto" />
              <h3 className="font-bold text-zinc-900">No Orders in Queue</h3>
              <p className="text-xs text-zinc-500">New customer orders will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {restOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs font-extrabold capitalize px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Customer: <strong className="text-zinc-700">{order.customerName}</strong> ({order.customerPhone}) · Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-zinc-900 tabular-nums">
                        ₹{order.total}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {order.paymentMethod.toUpperCase()} · {order.paymentStatus.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="bg-zinc-50 rounded-xl p-2.5 flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="tabular-nums text-zinc-500">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Workflow Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 text-xs">
                    <div className="text-zinc-500 text-[11px]">
                      Destination: {order.deliveryAddress.street}, {order.deliveryAddress.area}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'placed' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed', 'Kitchen acknowledged order')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled', 'Kitchen is currently overloaded')}
                            className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing', 'Chef started cooking food')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors"
                        >
                          Start Preparing Food
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready_for_pickup', 'Packed in insulated box, waiting for courier')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                        >
                          Mark Ready for Courier
                        </button>
                      )}

                      {order.status === 'ready_for_pickup' && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl">
                          Waiting for Delivery Partner Pickup
                        </span>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                          Courier Dispatched to Customer
                        </span>
                      )}

                      {order.status === 'delivered' && (
                        <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-xl">
                          Delivered Successfully
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Dishes & Menu Management</h2>
              <p className="text-xs text-zinc-500">Add food, edit prices, and toggle in-stock availability</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Prep Time</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {menuList.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-100"
                          />
                          <div>
                            <p className="font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-600">{item.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isVeg ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold tabular-nums text-zinc-900">₹{item.price}</td>
                      <td className="py-3 px-4 tabular-nums text-zinc-500">{item.prepTimeMinutes} mins</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleFoodAvailability(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                            title="Edit dish"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteFoodItem(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KITCHEN PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Restaurant Profile Settings</h2>
              <p className="text-xs text-zinc-500">Configure your storefront presence and operating parameters</p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isOpen ? 'Online & Open' : 'Temporarily Closed'}
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Restaurant Brand Name
                </label>
                <input
                  type="text"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Tag Line / Specialty
                </label>
                <input
                  type="text"
                  value={restTagline}
                  onChange={(e) => setRestTagline(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Full Kitchen Address
                </label>
                <input
                  type="text"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Avg Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Save Restaurant Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">
              {editingItemId ? 'Edit Menu Dish' : 'Add New Dish to Menu'}
            </h3>

            <form onSubmit={handleSaveFoodItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Mushroom Pizza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe flavors, ingredients, and spices..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starters, Mains, Dessert"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
