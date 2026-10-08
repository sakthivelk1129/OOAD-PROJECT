import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  ShoppingBag,
  Clock,
  RotateCcw,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';

export const OrdersHistoryPage: React.FC = () => {
  const { orders, navigate, addToCart, foodItems } = useApp();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const match = foodItems.find((f) => f.id === item.foodItemId);
      if (match) {
        addToCart(match, item.quantity);
      }
    });
    navigate('/cart');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">
            <Truck className="w-3 h-3" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'preparing':
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Preparing</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
            <span>Order Placed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Order History</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Track active orders, review past meals, and view tax invoices
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-zinc-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900">No Orders Yet</h3>
            <p className="text-xs text-zinc-500 mt-1">
              You haven&apos;t placed any orders yet. Discover delicious local restaurants!
            </p>
          </div>
          <button
            onClick={() => navigate('/restaurants')}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
          >
            Explore Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isLive = order.status !== 'delivered' && order.status !== 'cancelled';
            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all p-6 shadow-xs space-y-4 ${
                  isLive ? 'border-orange-300 ring-1 ring-orange-200 bg-orange-50/10' : 'border-zinc-200/80'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-zinc-900">
                        {order.restaurantName}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Order #{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-sm font-black text-zinc-900 tabular-nums">
                      ₹{order.total}
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Paid via {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Items summary */}
                <div className="text-xs text-zinc-600">
                  <p className="font-semibold text-zinc-800 mb-1">
                    Items ({order.items.reduce((s, it) => s + it.quantity, 0)}):
                  </p>
                  <p className="line-clamp-2 leading-relaxed text-zinc-500">
                    {order.items.map((it) => `${it.quantity}x ${it.name}`).join(' · ')}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                    <span>Delivered to {order.deliveryAddress.street}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold flex items-center gap-1.5 transition-colors"
                      title="Download receipt"
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>View Bill</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reorder</span>
                    </button>

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <span>{isLive ? 'Track Live' : 'Order Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={true}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
