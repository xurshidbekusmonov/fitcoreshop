'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, X, ShieldCheck, Truck, Trophy, Sparkles } from 'lucide-react';
import CartButton from './CartButton';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  onOpenCart: () => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  setSelectedCategory, 
  onOpenCart 
}: HeaderProps) {
  return (
    <>
      {/* Top Banner - Yuguruvchi qator (zamonaviy SVG belgilar bilan) */}
      <div className="bg-[#111111] text-[#D4AF37] text-[11px] py-2 border-b border-zinc-800/80 tracking-widest uppercase font-black overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 pr-12">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#D4AF37] stroke-[2.5]" /> 100% Original Sifat Kafolati
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} className="text-[#D4AF37] stroke-[2.5]" /> Butun O‘zbekiston bo‘ylab yetkazib berish
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Trophy size={14} className="text-[#D4AF37] stroke-[2.5]" /> Haqiqiy chempionlar tanlovi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#D4AF37] stroke-[2.5]" /> Top sifatli sport ozuqalari
          </span>
        </div>
        {/* Uzluksiz silliq aylanishi uchun aynan xuddi shu qatorning dublikati */}
        <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-12 pr-12" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#D4AF37] stroke-[2.5]" /> 100% Original Sifat Kafolati
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} className="text-[#D4AF37] stroke-[2.5]" /> Butun O‘zbekiston bo‘ylab yetkazib berish
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Trophy size={14} className="text-[#D4AF37] stroke-[2.5]" /> Haqiqiy chempionlar tanlovi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#D4AF37] stroke-[2.5]" /> Top sifatli sport ozuqalari
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-black/95 backdrop-blur-md text-white sticky top-0 z-40 shadow-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
          <Link 
            href="/"
            onClick={() => { setSelectedCategory('Barchasi'); setSearchQuery(''); }}
            className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white flex items-center gap-1 group cursor-pointer"
          >
            FITCORE<span className="text-[#D4AF37] not-italic group-hover:scale-105 transition-transform">SHOP</span>
          </Link>

          <div className="flex-1 max-w-lg relative hidden sm:block">
            <input
              type="text"
              placeholder="Mahsulot yoki brendlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] text-white px-4 py-2.5 pl-10 pr-9 rounded-xl text-xs outline-none transition placeholder:text-zinc-500 shadow-inner"
            />
            <Search className="absolute left-3.5 top-3 text-zinc-500" size={16} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-[#D4AF37] p-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 hover:bg-zinc-900"
            >
              <ShieldAlert size={16} />
              <span className="hidden md:inline">Admin</span>
            </Link>
            <CartButton onOpen={onOpenCart} />
          </div>
        </div>
      </header>
    </>
  );
}
