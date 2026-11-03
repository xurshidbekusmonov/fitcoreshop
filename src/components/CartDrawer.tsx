'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Orqa fon xiralashishi */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Sarlavha */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Savatcha</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mahsulotlar ro'yxati */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-base font-medium">Savatchangiz bo‘sh</p>
                <p className="text-xs mt-1">O‘zingizga yoqqan tovarlarni qo‘shing</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-100 pb-4 items-center"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-lg border p-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                      {item.title}
                    </h4>
                    {item.flavor && (
                      <span className="text-xs text-gray-400 block">{item.flavor}</span>
                    )}
                    <span className="text-sm font-bold text-blue-600 mt-1 block">
                      {item.price.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 rounded-l transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 rounded-r transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pastki hisob va buyurtma berish tugmasi */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium text-sm">Jami to‘lov:</span>
                <span className="text-lg font-black text-gray-900">
                  {totalPrice().toLocaleString('uz-UZ')} so‘m
                </span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md">
                Buyurtmani rasmiylashtirish <ArrowRight size={18} />
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-400 hover:text-red-500 mt-2 py-1 transition"
              >
                Savatchani tozalash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}