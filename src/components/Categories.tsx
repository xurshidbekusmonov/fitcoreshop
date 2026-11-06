'use client';

import React from 'react';
import {
  Sparkles,
  Milk,
  Dumbbell,
  Flame,
  FlaskConical,
  Zap,
  Pill,
  Target,
  Shield,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'Barchasi', icon: Sparkles },
  { id: 'Proteinlar', name: 'Proteinlar', icon: Milk },
  { id: 'Geynerlar', name: 'Geynerlar', icon: Dumbbell },
  { id: 'Kreatin', name: 'Kreatin', icon: Flame },
  { id: 'BCAA & Aminolar', name: 'BCAA & Aminolar', icon: FlaskConical },
  { id: 'Energiya & Pump', name: 'Energiya & Pump', icon: Zap },
  { id: 'Vitaminlar', name: 'Vitaminlar', icon: Pill },
  { id: 'Yog\' erituvchilar', name: 'Yog\' erituvchilar', icon: Target },
  { id: 'Tiklanish & Kuch', name: 'Tiklanish & Kuch', icon: Shield },
];

interface CategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps) {
  return (
    <section className="bg-black py-8 px-4 sm:px-6 border-b border-zinc-900 sticky top-[73px] z-30 backdrop-blur-md bg-black/90">
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3">
          Toifalar bo‘yicha tanlang
        </p>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name || (cat.id === 'all' && selectedCategory === 'Barchasi');
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name === 'Barchasi' ? 'Barchasi' : cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-105'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'stroke-[2.5] text-black' : 'stroke-[2] text-[#D4AF37]'}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
