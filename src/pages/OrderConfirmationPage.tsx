import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, Clock, MapPin, Bike, Sparkles, Home } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const { orders, navigate } = useApp();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Order Placed</h2>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 pb-32">
      {/* Success Badge & Animation Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed #{order.orderNumber}
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
            Cooking up something delicious!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-md mx-auto">
            Your order has been acknowledged by <strong className="text-zinc-800">{order.restaurantName}</strong> and is being prepared with fresh ingredients.
          </p>
        </div>

        {/* ETA Highlight */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-around text-xs">
          <div className="flex items-center gap-2 text-zinc-700 font-semibold">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Estimated Delivery:</span>
          </div>
          <span className="text-sm font-extrabold text-zinc-900 tabular-nums">
            {order.estimatedDeliveryMinutes} Minutes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">
          Receipt Details
        </h3>

        <div className="divide-y divide-zinc-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="text-zinc-700 font-medium">
                {item.quantity}x {item.name}
              </span>
              <span className="tabular-nums font-semibold text-zinc-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="py-3 flex items-center justify-between font-bold text-zinc-900 text-sm">
            <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-orange-600 tabular-nums">₹{order.total}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-zinc-50 rounded-2xl p-4 flex items-start gap-3 text-xs text-zinc-600">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-zinc-800">Delivering to {order.deliveryAddress.type}:</p>
            <p className="mt-0.5 text-zinc-600">{order.deliveryAddress.street}, {order.deliveryAddress.area}</p>
            <p className="text-zinc-500">{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
