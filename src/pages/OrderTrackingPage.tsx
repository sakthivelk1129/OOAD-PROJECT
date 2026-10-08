import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatusTracker } from '../components/OrderStatusTracker';
import { ArrowLeft } from 'lucide-react';

interface OrderTrackingPageProps {
  orderId: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId }) => {
  const { orders, navigate } = useApp();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Order #{orderId} Not Found</h2>
        <p className="text-xs text-zinc-500">
          We could not find the tracking information for this order ID.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
        >
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      <div>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order History</span>
        </button>
      </div>

      <OrderStatusTracker order={order} />
    </div>
  );
};
