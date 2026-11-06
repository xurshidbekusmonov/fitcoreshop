'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories, { CATEGORIES } from '@/components/Categories';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (selectedCategory !== 'Barchasi') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Xatolik:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Hero
        onCategorySelect={setSelectedCategory}
        onScrollToCatalog={handleScrollToCatalog}
      />

      <Features />

      <div id="catalog-section">
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {selectedCategory === 'Barchasi' ? 'Barcha tovarlar' : selectedCategory}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Top sifatli va kafolatlangan sport ozuqalari
            </p>
          </div>
          <span className="bg-zinc-900 border border-zinc-800 text-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
            {filteredProducts.length} ta
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-zinc-900/50 border border-zinc-800 h-80 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800">
            <p className="text-base font-bold uppercase text-zinc-400">Mahsulot topilmadi</p>
            <p className="text-xs text-zinc-600 mt-1">Boshqa so‘rov yoki kategoriyani tanlab ko‘ring</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  Ko‘proq ko‘rsatish
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-4 sm:px-6 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold tracking-wider uppercase text-zinc-400">© 2026 FitCoreShop. Barcha huquqlar himoyalangan.</p>
          <p className="text-[#D4AF37] font-semibold">Optimum Nutrition Style UI</p>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </main>
  );
} 