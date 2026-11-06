'use client';

import React from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCheckout: () => void; 
}) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 text-white shadow-2xl flex flex-col border-l border-zinc-800">
          <div className="p-4 bg-black text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">Savatcha</h2>
              <p className="text-[11px] text-[#D4AF37] font-semibold">{items.length} xil mahsulot</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <ShoppingCart size={44} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Savatchangiz bo‘sh</p>
                <p className="text-xs mt-1 text-zinc-500">O‘zingizga yoqqan mahsulotlarni tanlang</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-zinc-800/60 pb-3 items-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-xl p-1 flex items-center justify-center shrink-0 border border-zinc-800">
                    <img src={item.image_url} alt={item.title} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-white uppercase truncate">{item.title}</h4>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">{(item as any).weight_volume || item.flavor}</span>
                    <span className="text-xs font-black text-[#D4AF37] mt-1 block">
                      {item.price.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-zinc-800 text-zinc-300">
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-zinc-800 text-zinc-300">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500 p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-zinc-800 bg-black">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Jami to‘lov:</span>
                <span className="text-xl font-black text-white">
                  {totalPrice().toLocaleString('uz-UZ')} <span className="text-xs font-bold text-[#D4AF37]">so‘m</span>
                </span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] active:scale-98 text-black py-3 rounded-xl font-black text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                Buyurtmani tasdiqlash <ArrowRight size={16} />
              </button>
              <button onClick={clearCart} className="w-full text-center text-[11px] text-zinc-500 hover:text-red-400 mt-2 py-1">
                Savatchani tozalash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}