'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function CartButton({ onOpen }: { onOpen: () => void }) {
  const totalCount = useCartStore((state) => state.totalCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalCount() : 0;

  return (
    <button
      onClick={onOpen}
      className="relative flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C59B27] text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
    >
      <ShoppingCart size={16} className="text-black stroke-[2.5]" />
      <span className="hidden sm:inline">Savatcha</span>

      {/* Talab 2: Yuqoridagi savatcha bo'limida nechta tovar qo'shilgani yuqorida QIZIL bilan bilinib turishi */}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-black min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50 border-2 border-black animate-in zoom-in-75">
          {count}
        </span>
      )}
    </button>
  );
}
