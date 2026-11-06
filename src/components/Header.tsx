'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, X } from 'lucide-react';
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
      {/* Top Banner */}
      <div className="bg-[#111111] text-zinc-300 text-[11px] py-2 px-4 border-b border-zinc-800/80 tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
            <span>100% Original Sifat Kafolati • Butun O‘zbekiston bo‘ylab yetkazib berish</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-zinc-400">09:00 - 20:00</span>
            <a href="tel:+998781130219" className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white transition font-bold">
              +998 78 113 02 19
            </a>
          </div>
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