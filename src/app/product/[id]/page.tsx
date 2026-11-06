'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted ? items.find((i) => i.id === productId) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) setProduct(data);
      setLoading(false);
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Mahsulot ma’lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Mahsulot topilmadi</h2>
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-semibold">
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b py-4 px-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={18} /> Orqaga qaytish
          </Link>
          <span className="text-xl font-black text-blue-600">
            FITCORE<span className="text-orange-500">SHOP</span>
          </span>
          <Link href="/" className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-700">
            Do‘kon
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-sm">
          {/* Rasm qismi */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8 border border-gray-100">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600'}
              alt={product.title}
              className="max-h-96 object-contain hover:scale-105 transition duration-300"
            />
          </div>

          {/* Ma'lumot qismi */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {product.brand}
                </span>
                {product.badge && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Narx */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {product.old_price && (
                  <span className="text-sm text-gray-400 line-through block">
                    {Number(product.old_price).toLocaleString('uz-UZ')} so‘m
                  </span>
                )}
                <span className="text-3xl font-black text-blue-700">
                  {Number(product.price).toLocaleString('uz-UZ')} so‘m
                </span>
              </div>

              {/* Xususiyatlari */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">Ta'mi:</span>
                  <span className="font-semibold text-gray-800">{product.flavor || 'Standart'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">Hajmi / Og‘irligi:</span>
                  <span className="font-semibold text-gray-800">{product.weight_volume || 'Standart'}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">Mavjudligi:</span>
                  <span className="font-semibold text-green-600">Omborda bor</span>
                </div>
              </div>
            </div>

            {/* Savatchaga qo'shish yoki [-] soni [+] */}
            <div>
              {quantity > 0 ? (
                <div className="w-full flex items-center justify-between bg-blue-50 border-2 border-blue-600 rounded-xl p-2 shadow-sm">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    aria-label="Kamaytirish"
                    className="w-12 h-10 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-black cursor-pointer shadow-xs text-blue-700 active:scale-95"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-extrabold text-base text-blue-900 px-4">
                    {quantity} dona savatda
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label="Ko‘paytirish"
                    className="w-12 h-10 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-black cursor-pointer shadow-xs text-blue-700 active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addItem(product)}
                  className="w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-blue-600 hover:bg-blue-700 text-white active:scale-98"
                >
                  <ShoppingCart size={20} /> Savatchaga qo‘shish
                </button>
              )}

              {/* Kafolat bloklari */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="text-green-600" size={20} />
                  <span>100% Original</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="text-blue-600" size={20} />
                  <span>Tezkor yetkazish</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="text-orange-500" size={20} />
                  <span>Sifat kafolati</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
