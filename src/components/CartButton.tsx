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
      {count > 0 && (
        <span className="bg-black text-[#D4AF37] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}