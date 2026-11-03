'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function ProductCard({ item }: { item: any }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
      <div className="p-4 relative">
        {item.badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
            {item.badge}
          </span>
        )}
        <div className="h-44 w-full flex items-center justify-center my-2">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'}
            alt={item.title}
            className="h-full object-contain hover:scale-105 transition"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">{item.brand}</span>
        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mt-1 mb-2 hover:text-blue-600 cursor-pointer">
          {item.title}
        </h3>

        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 flex justify-between mb-3 border border-gray-100">
          <span>{item.flavor || 'Standart'}</span>
          <span className="font-semibold">{item.weight_volume || '-'}</span>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-gray-100 mt-2">
        <div className="my-2">
          {item.old_price && (
            <span className="text-xs text-gray-400 line-through block">
              {Number(item.old_price).toLocaleString('uz-UZ')} so‘m
            </span>
          )}
          <span className="text-base font-extrabold text-blue-700">
            {Number(item.price).toLocaleString('uz-UZ')} so‘m
          </span>
        </div>
        <button
          onClick={() => addItem(item)}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <ShoppingCart size={15} /> Savatchaga
        </button>
      </div>
    </div>
  );
}