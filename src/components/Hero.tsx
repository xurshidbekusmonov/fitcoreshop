'use client';

import React from 'react';
import { Award } from 'lucide-react';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  onScrollToCatalog: () => void;
}

export default function Hero({ onCategorySelect, onScrollToCatalog }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-black text-white py-16 lg:py-24 px-4 sm:px-6 border-b border-zinc-900">
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase text-[#D4AF37] tracking-widest shadow-sm">
            <Award size={14} /> Haqiqiy Standart
          </div>
          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none">
            GOLD STANDART <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-600 not-italic">
              NATIJAGA ERISHING
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl font-normal">
            Eng yuqori tozalikdagi proteinlar, kreatinlar va original vitaminlar. Chempionlar tanlovi endi O‘zbekistonda.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onScrollToCatalog}
              className="bg-[#D4AF37] hover:bg-[#C59B27] text-black font-black uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer active:scale-95"
            >
              Katalogni ko‘rish
            </button>
            <button 
              onClick={() => onCategorySelect('Proteinlar')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Proteinlar
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col items-center justify-center text-center group">
            <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              Top Mahsulot
            </span>
            <div className="h-64 w-full flex items-center justify-center my-4">
              <img 
                src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500" 
                alt="Gold Standard Protein" 
                className="h-full object-contain drop-shadow-[0_15px_15px_rgba(212,175,55,0.15)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-extrabold text-sm uppercase text-white tracking-wider">Optimum Nutrition Gold Standard</h3>
            <p className="text-xs text-[#D4AF37] font-bold mt-1">100% Whey Protein • 2.27 kg</p>
          </div>
        </div>

      </div>
    </section>
  );
}