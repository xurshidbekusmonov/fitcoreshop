'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function ProductCard({ item }: { item: any }) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted ? items.find((i) => i.id === item.id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  const discountPercent = item.old_price && item.old_price > item.price
    ? Math.round(((item.old_price - item.price) / item.old_price) * 100)
    : null;

  return (
    <div className="group bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-[#D4AF37]/50 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1 flex flex-col justify-between relative">
      <div>
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {item.badge && (
            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider shadow-sm">
              {item.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        <Link href={`/product/${item.id}`} className="block overflow-hidden rounded-2xl bg-zinc-950 p-4 mb-4 group-hover:bg-black transition">
          <div className="h-52 w-full flex items-center justify-center">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'}
              alt={item.title}
              className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-zinc-500">
            {item.brand || 'OPTIMUM'}
          </span>
          <div className="flex items-center text-[#D4AF37] text-xs gap-0.5">
            <Star size={13} className="fill-[#D4AF37]" />
            <span className="text-zinc-200 font-extrabold text-xs ml-0.5">4.9</span>
          </div>
        </div>

        <Link href={`/product/${item.id}`}>
          <h3 className="font-extrabold text-sm text-white uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition">
            {item.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
          <span className="bg-zinc-800 px-2 py-0.5 rounded font-semibold text-zinc-300">
            {item.flavor || 'Standart'}
          </span>
          <span>•</span>
          <span className="font-bold text-zinc-300">{item.weight_volume || '1 dona'}</span>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-zinc-800/80">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-black text-white tracking-tight">
            {Number(item.price).toLocaleString('uz-UZ')} <span className="text-xs font-bold text-zinc-400">so‘m</span>
          </span>
          {item.old_price && (
            <span className="text-xs text-zinc-500 line-through font-semibold">
              {Number(item.old_price).toLocaleString('uz-UZ')} so‘m
            </span>
          )}
        </div>

        {/* Talab 2: Agar tovar savatda bo'lsa - soni + chiqadi, 0 ga tushsa yana Savatchaga qo'shish tugmasi chiqadi */}
        {quantity > 0 ? (
          <div className="w-full flex items-center justify-between bg-zinc-950 border border-[#D4AF37] rounded-xl p-1 shadow-lg shadow-[#D4AF37]/10 animate-in fade-in">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              aria-label="Kamaytirish"
              className="w-9 h-8 rounded-lg bg-zinc-900 hover:bg-[#D4AF37] text-zinc-200 hover:text-black flex items-center justify-center transition-all font-black cursor-pointer active:scale-90"
            >
              <Minus size={14} className="stroke-[3]" />
            </button>
            <span className="font-black text-sm text-[#D4AF37] px-3 select-none">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              aria-label="Ko‘paytirish"
              className="w-9 h-8 rounded-lg bg-zinc-900 hover:bg-[#D4AF37] text-zinc-200 hover:text-black flex items-center justify-center transition-all font-black cursor-pointer active:scale-90"
            >
              <Plus size={14} className="stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="w-full bg-[#D4AF37] hover:bg-[#C59B27] text-black py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
          >
            <ShoppingCart size={14} className="stroke-[2.5]" /> Savatchaga qo‘shish
          </button>
        )}
      </div>
    </div>
  );
}
