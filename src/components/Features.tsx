'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-black border-b border-zinc-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <Truck size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Tezkor yetkazish</h4>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Butun O‘zbekiston bo‘ylab 24 soat ichida</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">100% Original</h4>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Rasmiy laboratoriya tekshiruvidan o‘tgan</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <RefreshCw size={22} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Ishonchli to‘lov</h4>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Payme, Click yoki qabul qilganda naqd</p>
          </div>
        </div>
      </div>
    </section>
  );
}