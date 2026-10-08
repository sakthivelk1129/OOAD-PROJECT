import React from 'react';
import { Order } from '../types';
import { X, Printer, Download, CheckCircle, UtensilsCrossed } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-zinc-200 shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Tax Invoice / Bill</h3>
              <p className="text-xs text-zinc-400">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-6 text-xs text-zinc-600 font-sans" id="printable-bill">
          {/* Restaurant & Date Block */}
          <div className="flex justify-between border-b border-zinc-100 pb-4">
            <div>
              <p className="font-bold text-sm text-zinc-900">{order.restaurantName}</p>
              <p className="text-zinc-500">{order.restaurantAddress}</p>
              <p className="text-zinc-400 mt-1">FSSAI Lic. #11223344556677</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-zinc-800">Date & Time</p>
              <p className="text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle className="w-3 h-3" />
                <span>PAID ({order.paymentMethod.toUpperCase()})</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Block */}
          <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex justify-between">
            <div>
              <p className="font-bold text-zinc-800">Billed To:</p>
              <p className="text-zinc-700 font-medium">{order.customerName}</p>
              <p className="text-zinc-500">{order.customerPhone}</p>
            </div>
            <div className="text-right max-w-[200px]">
              <p className="font-bold text-zinc-800">Delivery Address:</p>
              <p className="text-zinc-600">{order.deliveryAddress.street}, {order.deliveryAddress.area}</p>
              <p className="text-zinc-500">{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="text-zinc-800">
                    <td className="py-2.5 font-medium">{it.name}</td>
                    <td className="py-2.5 text-center tabular-nums">{it.quantity}</td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-500">₹{it.price}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold">₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="border-t border-zinc-200 pt-4 space-y-1.5 text-zinc-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="tabular-nums font-medium text-zinc-800">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promotional Discount</span>
                <span className="tabular-nums">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Partner Fee</span>
              <span className="tabular-nums text-zinc-800">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Service Fee</span>
              <span className="tabular-nums text-zinc-800">₹{order.platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Restaurant Taxes (5%)</span>
              <span className="tabular-nums text-zinc-800">₹{order.taxes}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-zinc-200 text-sm font-extrabold text-zinc-900">
              <span>Final Total Paid</span>
              <span className="tabular-nums text-base text-orange-600">₹{order.total}</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-zinc-400 text-center">
            This is a computer-generated invoice for your QuickBite order. Thank you for dining with us!
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
