'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useI18n } from '@/lib/useI18n';

export default function CartButton({ onOpen }: { onOpen: () => void }) {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQuantity = mounted
    ? items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
    : 0;

  return (
    <button
      onClick={onOpen}
      className="relative flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C59B27] text-black px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingCart size={17} className="text-black stroke-[2.5]" />
      </div>
      <span className="hidden sm:inline">{t("cart")}</span>

      {/* Savatchaga tovar qo'shilsa yuqorisida qizil belgicha (soni bilan) */}
      {totalQuantity > 0 && (
        <span className="absolute -top-2.5 -right-2.5 z-20 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-600 text-white text-[11px] font-black border-2 border-black shadow-lg shadow-red-600/60 leading-none">
            {totalQuantity}
          </span>
        </span>
      )}
    </button>
  );
}
