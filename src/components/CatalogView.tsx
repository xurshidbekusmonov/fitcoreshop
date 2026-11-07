'use client';

import { useState } from 'react';
// Agar sizda ProductCard komponenti boshqa joyda bo'lsa, yo'lini moslang:
import ProductCard from './ProductCard'; 

// Bazadagi bo'limlar nomi bilan bir xil ro'yxat:
const CATEGORIES = [
  'Barchasi',
  'Proteinlar',
  'Geynerlar',
  'Kreatin',
  'BCAA & Aminolar',
  'Energiya & Pump',
  'Yog\' erituvchilar',
  'Vitaminlar',
  'Tiklanish & Kuch',
];

export default function CatalogView({ initialProducts }: { initialProducts: any[] }) {
  // Hozir qaysi bo'lim tanlanganini saqlaymiz (boshlanishida "Barchasi")
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  // Mantiq: "Barchasi" tanlansa hamma tovar chiqadi, boshqa bo'lim tanlansa faqat o'shalar saralanadi
  const filteredProducts =
    selectedCategory === 'Barchasi'
      ? initialProducts
      : initialProducts.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-6">
      {/* 1. Bo'limlar tugmalari qatori (telefonda yon tomonga siljiydi) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-semibold shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2. Topilgan tovarlar soni */}
      <div className="mb-4 text-sm text-zinc-400">
        Jami: <strong className="text-white">{filteredProducts.length}</strong> ta tovar
      </div>

      {/* 3. Tovarlar katakchalari (Grid) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 border border-zinc-800 rounded-xl">
          Bu bo'limda hozircha tovarlar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      )}
    </section>
  );
}
