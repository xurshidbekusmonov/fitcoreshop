import React from 'react';

// 1. Mahsulot ma'lumotlarining turlari (TypeScript interfeysi)
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight?: string;
  flavor?: string;
  image_url: string;
}

export default function ProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: Product; 
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div className="group relative flex flex-col justify-between bg-[#15181e] border border-neutral-800 hover:border-amber-500/60 rounded-xl p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
      
      {/* 2. Tepa qism: Kategoriya va Og'irlik (masalan: PROTEIN va 2.27 KG) */}
      <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-2">
        <span>{product.category}</span>
        {product.weight && (
          <span className="bg-neutral-850 border border-neutral-700/60 px-2 py-0.5 rounded text-neutral-300 text-[11px]">
            {product.weight}
          </span>
        )}
      </div>

      {/* 3. O'rta qism: Mahsulot bankasi rasmi (Hover bo'lganda biroz kattalashadi) */}
      <div className="relative w-full h-56 my-2 flex items-center justify-center overflow-hidden rounded-lg bg-[#0e1015]">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 4. Matn qismi: Oltin yulduzchalar reytingi va mahsulot nomi */}
      <div className="mt-3">
        <div className="flex items-center space-x-1 text-amber-400 text-xs mb-1">
          <span>★★★★★</span>
          <span className="text-neutral-500 text-[11px]">(4.9)</span>
        </div>
        
        {/* Nomi Optimum Nutrition uslubidagi katta va qalin harflarda */}
        <h3 className="font-extrabold text-sm md:text-base text-white tracking-wide uppercase line-clamp-2 h-11">
          {product.name}
        </h3>
        
        {product.flavor && (
          <p className="text-xs text-neutral-400 mt-1">Ta'mi: {product.flavor}</p>
        )}
      </div>

      {/* 5. Pastki qism: Oltin rangli narx va "SAVATGA" tugmasi */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-neutral-400 block">Narxi</span>
          <span className="text-lg font-black text-amber-400 tracking-tight">
            {product.price.toLocaleString()} <span className="text-xs font-bold text-neutral-300">so'm</span>
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs md:text-sm px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors duration-200 active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
        >
          Savatga
        </button>
      </div>

    </div>
  );
}