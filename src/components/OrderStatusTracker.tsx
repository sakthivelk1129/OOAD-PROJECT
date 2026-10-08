import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  MapPin,
  Phone,
  FileText,
  RotateCcw,
  FastForward,
  UtensilsCrossed,
} from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';

interface OrderStatusTrackerProps {
  order: Order;
}

const STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Placed', desc: 'Received & sent to kitchen' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Restaurant accepted order' },
  { key: 'preparing', label: 'Preparing', desc: 'Chef is cooking your food' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your fresh meal!' },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order }) => {
  const { advanceOrderStage, addToCart, navigate, foodItems } = useApp();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Find index in stages
  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready_for_pickup':
        return 2.5;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentIdx = getStageIndex(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  // Handle re-ordering
  const handleReorder = () => {
    order.items.forEach((item) => {
      const match = foodItems.find((f) => f.id === item.foodItemId);
      if (match) {
        addToCart(match, item.quantity);
      }
    });
    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-8">
      {/* Top Banner: Status Header & Time */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              Order #{order.orderNumber}
            </span>
            <span className="text-xs text-zinc-400">
              Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 mt-2 tracking-tight">
            {isCancelled
              ? 'Order Cancelled'
              : isDelivered
              ? 'Delivered to your doorstep'
              : order.status === 'out_for_delivery'
              ? 'Courier is arriving shortly!'
              : order.status === 'preparing'
              ? 'Your meal is being freshly prepared'
              : 'Kitchen is confirming your order'}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {order.restaurantName} · Delivering to {order.deliveryAddress.street}
          </p>
        </div>

        {/* ETA Widget or Reorder */}
        <div className="flex items-center gap-3">
          {!isDelivered && !isCancelled ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-center min-w-[130px]">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Estimated Time</span>
              </div>
              <p className="text-lg font-black text-emerald-800 mt-0.5 tabular-nums">
                {order.estimatedDeliveryMinutes} mins
              </p>
            </div>
          ) : (
            <button
              onClick={handleReorder}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder Entire Meal</span>
            </button>
          )}

          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            title="View invoice receipt"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Tax Bill</span>
          </button>
        </div>
      </div>

      {/* Interactive Simulation Control (For demo testing) */}
      {!isDelivered && !isCancelled && (
        <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>Live simulation active. Want to test delivery progression?</span>
          </div>
          <button
            onClick={() => advanceOrderStage(order.id)}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5 text-orange-400" />
            <span>Simulate Next Stage →</span>
          </button>
        </div>
      )}

      {/* Visual Step Progress Bar */}
      {!isCancelled && (
        <div className="py-2">
          <div className="relative">
            {/* Background Track Line */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-zinc-100 -z-0"></div>
            {/* Active Track Line */}
            <div
              className="absolute top-4 left-6 h-1 bg-emerald-500 transition-all duration-500 -z-0"
              style={{
                width: `${Math.min(100, Math.max(0, (currentIdx / 4) * 100))}%`,
              }}
            ></div>

            {/* Stages Grid */}
            <div className="relative z-10 grid grid-cols-5 text-center">
              {STAGES.map((st, i) => {
                const isPassed = currentIdx >= i;
                const isCurrent = Math.floor(currentIdx) === i;

                return (
                  <div key={st.key} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-100 text-zinc-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2.5 font-bold leading-tight ${
                        isPassed ? 'text-zinc-900' : 'text-zinc-400'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 hidden sm:block max-w-[90px]">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Rider & Restaurant Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Rider Card */}
        <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-zinc-900">
                  {order.deliveryPartnerName || 'Assigned Courier'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  4.9 ★
                </span>
              </div>
              <p className="text-xs text-zinc-500">Fast Fleet Rider · Verified Partner</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">EV Scooter #MC-9082</p>
            </div>
          </div>

          <a
            href={`tel:${order.deliveryPartnerPhone || '+15557731029'}`}
            className="w-9 h-9 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-emerald-600 hover:border-emerald-300 flex items-center justify-center transition-colors shadow-sm"
            title="Call delivery partner"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Restaurant Card */}
        <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900 line-clamp-1">{order.restaurantName}</p>
              <p className="text-xs text-zinc-500 line-clamp-1">{order.restaurantAddress}</p>
              <button
                onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                className="text-[11px] font-semibold text-orange-600 hover:underline mt-0.5 inline-block"
              >
                View Full Restaurant Menu →
              </button>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="border border-zinc-100 rounded-2xl p-5 bg-zinc-50/40">
        <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider mb-3">
          Ordered Dishes ({order.items.reduce((s, it) => s + it.quantity, 0)})
        </h4>
        <div className="space-y-2.5 divide-y divide-zinc-100">
          {order.items.map((it, idx) => (
            <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 tabular-nums">{it.quantity}x</span>
                <span className="font-medium text-zinc-800">{it.name}</span>
              </div>
              <span className="font-semibold text-zinc-900 tabular-nums">
                ₹{it.price * it.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-900">
          <span>Total Amount Paid</span>
          <span className="tabular-nums text-sm text-orange-600">₹{order.total}</span>
        </div>
      </div>

      {/* Timeline Audit Logs */}
      <div>
        <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3">
          Status Activity Log
        </h4>
        <div className="space-y-3">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800">{step.label}</span>
                  <span className="text-zinc-400 tabular-nums text-[11px]">{step.timestamp}</span>
                </div>
                {step.note && <p className="text-zinc-500 text-[11px] mt-0.5">{step.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
