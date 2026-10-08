import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  TrendingUp,
  Package,
  Navigation,
  Power,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DELIVERY_HERO } from '../data/mockData';

export const DeliveryDashboard: React.FC = () => {
  const { currentUser, orders, updateOrderStatus, updateUserProfile, showToast } = useApp();

  const [isOnline, setIsOnline] = useState(currentUser.isAvailable !== false);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    updateUserProfile({ isAvailable: next });
    showToast(next ? 'You are now Online & ready for orders' : 'You are now Offline');
  };

  // Orders in delivery scope
  const activeDeliveries = orders.filter((o) =>
    ['ready_for_pickup', 'out_for_delivery'].includes(o.status)
  );

  const availableDeliveries = orders.filter((o) =>
    ['confirmed', 'preparing'].includes(o.status) && !o.deliveryPartnerId
  );

  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  // Rider earnings: standard base pay ₹45 + distance bonus
  const earnings = completedDeliveries.length * 65;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Top Rider Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Courier Partner Console
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hi, {currentUser.name}
          </h1>

          <p className="text-xs text-zinc-400 max-w-md">
            Vehicle: {currentUser.deliveryVehicle || 'EV Scooter #MC-9082'} · 4.9★ Fleet Rating
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isOnline
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? 'Online (Accepting Deliveries)' : 'Offline (Paused)'}</span>
            </button>
          </div>
        </div>

        <div className="w-36 h-28 rounded-2xl overflow-hidden border border-zinc-700 shadow-md hidden sm:block shrink-0">
          <img
            src={DELIVERY_HERO}
            alt="Delivery partner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Today&apos;s Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            ₹{earnings}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">₹65 avg. per trip</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Active Assignments</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {activeDeliveries.length}
          </p>
          <p className="text-[11px] text-orange-600 font-medium mt-0.5">En route or at kitchen</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Trips Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-2 tabular-nums">
            {completedDeliveries.length}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">100% On-time score</p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Fleet Safety Standing</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-black text-emerald-700 mt-2">
            Top 5% Diamond
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Insured & verified</p>
        </div>
      </div>

      {/* ACTIVE DELIVERIES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-orange-500" />
            <span>Active Delivery Route</span>
          </h2>
          <span className="text-xs font-bold text-zinc-400 tabular-nums">
            {activeDeliveries.length} active
          </span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-md mx-auto space-y-3">
            <Package className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="font-bold text-zinc-900">No Active Deliveries</h3>
            <p className="text-xs text-zinc-500">
              {isOnline
                ? 'Waiting for nearby restaurants to dispatch freshly prepared orders.'
                : 'Turn your status to Online above to receive assigned trips.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-orange-200 ring-1 ring-orange-200/50 p-6 shadow-sm space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        Trip #{order.orderNumber}
                      </span>
                      <span className="text-xs font-extrabold capitalize text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Customer payout: ₹65 · Cash to collect:{' '}
                      <strong className="text-zinc-800">
                        {order.paymentMethod === 'cod' ? `₹${order.total}` : '₹0 (Prepaid)'}
                      </strong>
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                    ETA: ~{order.estimatedDeliveryMinutes} mins
                  </span>
                </div>

                {/* Pickup & Drop Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Restaurant Pickup */}
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        1. Pickup Kitchen
                      </span>
                      <span className="text-[11px] font-semibold text-orange-600">
                        {order.status === 'ready_for_pickup' ? 'Ready for Pickup' : 'Cooking'}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-zinc-900">{order.restaurantName}</p>
                    <p className="text-xs text-zinc-500">{order.restaurantAddress}</p>
                    <div className="pt-1 text-xs text-zinc-400">
                      Items: {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  {/* Customer Drop */}
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        2. Customer Drop
                      </span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                    <p className="font-bold text-sm text-zinc-900">{order.customerName}</p>
                    <p className="text-xs text-zinc-500">
                      {order.deliveryAddress.street}, {order.deliveryAddress.area}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                    </p>
                  </div>
                </div>

                {/* Status Progression Buttons for Delivery Rider */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100">
                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          'out_for_delivery',
                          'Rider picked up food from restaurant and started journey'
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                      <span>Confirm Food Pickup & Depart</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          'delivered',
                          'Customer received meal in person. Delivery completed!'
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Order Delivered to Customer</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED RECENT DELIVERIES */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Completed Trip History</h2>
        {completedDeliveries.length === 0 ? (
          <p className="text-xs text-zinc-400">No trips completed today yet.</p>
        ) : (
          <div className="bg-white rounded-3xl border border-zinc-200/80 divide-y divide-zinc-100 shadow-xs">
            {completedDeliveries.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900">
                    Order #{order.orderNumber} · {order.restaurantName}
                  </p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Delivered to {order.customerName} ({order.deliveryAddress.street})
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-600 tabular-nums">+₹65 Earned</span>
                  <p className="text-[10px] text-zinc-400">Delivered</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
