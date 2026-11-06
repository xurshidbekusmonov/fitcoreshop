'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Award, ChevronLeft, ChevronRight, ArrowRight, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  onScrollToCatalog: () => void;
}

const DEFAULT_TOP_PRODUCTS = [
  {
    id: 'ba10f886-0853-4a1a-b0d6-9e32e9cfad8d',
    title: 'ON Whey Gold Standard 100%',
    brand: 'Optimum Nutrition',
    price: 649000,
    old_price: 720000,
    badge: 'TOP #1 HIT',
    flavor: 'Extreme Milk Chocolate',
    weight_volume: '907 g (2 LB)',
    image_url: 'https://i5.walmartimages.com/seo/Optimum-Nutrition-Gold-Standard-100-Whey-Protein-Powder-Extreme-Milk-Chocolate-24g-Protein-2-LB_af1c2407-b4d4-4bcb-92b3-9a083cda628c.e932faef2e274b5eb5c5d6682492daac.jpeg',
  },
  {
    id: 'fd46a6b7-fbdb-444b-92f9-b53f262efb2b',
    title: '1 RULE WHEY ISOLATE 900G',
    brand: '1RULE',
    price: 699000,
    old_price: 780000,
    badge: '100% ISOLATE',
    flavor: 'Vanilla Creme',
    weight_volume: '900 g',
    image_url: 'https://m.media-amazon.com/images/I/71sUtJjGFcL._AC_SX679_.jpg',
  },
  {
    id: 'c3e7eef2-8f9a-4a4f-8ca8-3205ab12ea79',
    title: 'ON Whey Gold 2.27kg USA',
    brand: 'Optimum Nutrition',
    price: 1240000,
    old_price: 1350000,
    badge: 'MAKSIMAL HAJM',
    flavor: 'Banana Cream',
    weight_volume: '2.27 kg (5 lbs)',
    image_url: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTmO3RRJtsB4G-yHcQ_f0Ek458nAYCBVsCY0Zf910sQzLIZYAkhKt27t8jzQeRnhtsB34ukkdif6z3KucXPerR3qeBOGDZAMwP60-zOTqpEXbvQ6zQCsDksC-4JIf-ombWXoOLapQ&usqp=CAc',
  },
  {
    id: 'e5bebf8e-212c-4280-afd3-5c7dce1e9c4b',
    title: '1 RULE WHEY PROTEIN 2.28 kg',
    brand: '1 Rule',
    price: 890000,
    old_price: 980000,
    badge: 'XIT SAVDO',
    flavor: 'Chocolate Fudge',
    weight_volume: '2.28 kg',
    image_url: 'https://blb.uz/image/cache/catalog/image/cache/catalog/tovar52/r1-whey-blend-2300gr-chocolate-fudge-800x800.webp',
  },
];

export default function Hero({ onCategorySelect, onScrollToCatalog }: HeroProps) {
  const [topProducts, setTopProducts] = useState(DEFAULT_TOP_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Bazadagi eng top 4 ta tovarlarni olib kelish (agar mavjud bo'lsa)
  useEffect(() => {
    async function loadTopProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .not('badge', 'is', null)
          .limit(4);

        if (!error && data && data.length > 0) {
          const combined = [
            ...data,
            ...DEFAULT_TOP_PRODUCTS.filter((d) => !data.some((p) => p.id === d.id)),
          ].slice(0, 4);
          setTopProducts(combined);
        }
      } catch (err) {
        console.error('Top mahsulotlarni yuklashda xatolik:', err);
      }
    }

    loadTopProducts();
  }, []);

  const total = topProducts.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Talab 1: Karusel avtomatik har 3 soniyada (3000ms) keyingisiga o'tadi
  useEffect(() => {
    if (isPaused || total === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, total]);

  const currentItem = topProducts[currentIndex] || topProducts[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <section className="relative overflow-hidden bg-black text-white py-14 lg:py-20 px-4 sm:px-6 border-b border-zinc-900">
      {/* Orqa fon nur effekti */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Chap qism: Asosiy chaqiriq */}
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

        {/* O'ng qism: 4 ta TOP Mahsulot Karuseli */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none" />
          
          <div 
            className="relative z-10 w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 sm:p-7 rounded-3xl border border-zinc-800 shadow-2xl shadow-black/80 flex flex-col justify-between group select-none transition-all duration-300 hover:border-[#D4AF37]/50"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Tepasidagi qator: Nishon va Hisoblagich */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-black text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                <Flame size={13} className="fill-black" />
                {currentItem.badge || 'TOP MAHSULOT'}
              </span>

              <div className="flex items-center gap-1 bg-black/60 border border-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-black text-zinc-400">
                <span className="text-[#D4AF37]">0{currentIndex + 1}</span>
                <span>/</span>
                <span>0{total}</span>
              </div>
            </div>

            {/* Navigatsiya tugmalari (Oldingi / Keyingi) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Oldingi mahsulot"
              className="absolute left-2 top-[45%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-[#D4AF37] text-zinc-300 hover:text-black border border-zinc-800 hover:border-[#D4AF37] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-xs opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Keyingi mahsulot"
              className="absolute right-2 top-[45%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-[#D4AF37] text-zinc-300 hover:text-black border border-zinc-800 hover:border-[#D4AF37] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-xs opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>

            {/* Talab 1: Ustiga bosilsa to'g'ridan-to'g'ri o'sha tovarga olib tushadi */}
            <Link 
              href={`/product/${currentItem.id}`}
              className="block group/link cursor-pointer"
            >
              {/* Rasm qismi */}
              <div className="relative h-56 sm:h-64 w-full my-2 bg-gradient-to-b from-zinc-950/80 to-zinc-900/40 rounded-2xl p-4 flex items-center justify-center border border-zinc-800/60 overflow-hidden">
                <img 
                  key={currentItem.id}
                  src={currentItem.image_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'} 
                  alt={currentItem.title} 
                  className="h-full max-w-full object-contain drop-shadow-[0_15px_20px_rgba(212,175,55,0.18)] transition-all duration-500 group-hover/link:scale-108 animate-in fade-in zoom-in-95"
                />
              </div>

              {/* Ma'lumot qismi */}
              <div className="pt-2 text-center">
                <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest block mb-1">
                  {currentItem.brand || 'OPTIMUM NUTRITION'}
                </span>

                <h3 className="font-extrabold text-sm sm:text-base uppercase text-white tracking-tight line-clamp-1 group-hover/link:text-[#D4AF37] transition">
                  {currentItem.title}
                </h3>

                {/* Xususiyatlari */}
                <div className="flex items-center justify-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                  <span className="bg-zinc-800/80 px-2.5 py-0.5 rounded-md font-semibold text-zinc-300">
                    {currentItem.flavor || 'Standart'}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-zinc-300">
                    {currentItem.weight_volume || '1 dona'}
                  </span>
                </div>

                {/* Narx va Ko'rish havolasi */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="text-left">
                    {currentItem.old_price && currentItem.old_price > currentItem.price && (
                      <span className="text-[11px] text-zinc-500 line-through block leading-tight font-semibold">
                        {Number(currentItem.old_price).toLocaleString('uz-UZ')} so‘m
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-black text-white tracking-tight">
                      {Number(currentItem.price).toLocaleString('uz-UZ')}{' '}
                      <span className="text-[11px] font-bold text-[#D4AF37]">so‘m</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 group-hover/link:border-[#D4AF37] text-zinc-300 group-hover/link:text-[#D4AF37] px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                    Batafsil <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Karusel nuqtalari (Dots / Indicators) */}
            <div className="flex items-center justify-center gap-1.5 mt-4 pt-1">
              {topProducts.map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Slayd ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-[#D4AF37] shadow-sm shadow-[#D4AF37]/50'
                      : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
