'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { useI18n } from '@/lib/useI18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { t, tCategory } = useI18n();

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
        {t("loadingProduct")}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <h2 className="text-2xl font-bold mb-2">{t("productNotFound")}</h2>
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-semibold">
          <ArrowLeft size={16} /> {t("backToHome")}
        </Link>
      </div>
    );
  }

  const isUnavailable = product.stock === 0 || product.in_stock === false;

  return (
    <div className="detail-page min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b py-4 px-6 shadow-xs sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={18} /> {t("back")}
          </Link>
          <span className="text-xl font-black text-blue-600">
            FITCORE<span className="text-orange-500">SHOP</span>
          </span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/" className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-700">
              {t("shop")}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-xs">
          {/* Rasm qismi */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8 border border-gray-100">
            <img
              src={product.image_url || '/product-placeholder.svg'}
              onError={e=>{e.currentTarget.src='/product-placeholder.svg'}}
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
                {product.category && (
                  <span className="bg-zinc-100 text-zinc-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {tCategory(product.category)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Narx */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {Number(product.old_price) > Number(product.price) && (
                  <span className="text-sm text-gray-400 line-through block">
                    {formatPrice(product.old_price)} {t("currency")}
                  </span>
                )}
                <span className="text-3xl font-black text-blue-700">
                  {formatPrice(product.price)} {t("currency")}
                </span>
              </div>

              {/* Xususiyatlari */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">{t("flavorLabel")}</span>
                  <span className="font-semibold text-gray-800">{product.flavor || t("standard")}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">{t("weightLabel")}</span>
                  <span className="font-semibold text-gray-800">{product.weight_volume || t("standard")}</span>
                </div>
                <div className="flex justify-between border-b pb-2 text-sm">
                  <span className="text-gray-500">{t("availabilityLabel")}</span>
                  <span className={`font-semibold ${isUnavailable ? 'text-red-500' : 'text-green-600'}`}>
                    {isUnavailable ? t("outOfStockStatus") : t("availableToOrder")}
                  </span>
                </div>
              </div>
            </div>

            {/* Savatchaga qo'shish yoki [-] soni [+] */}
            <div>
              {quantity > 0 ? (
                <div className="w-full flex items-center justify-between bg-blue-50 border-2 border-blue-600 rounded-xl p-2 shadow-xs">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    aria-label="Decrease"
                    className="w-12 h-10 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-black cursor-pointer shadow-2xs text-blue-700 active:scale-95"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-extrabold text-base text-blue-900 px-4">
                    {quantity} {t("inCart")}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label="Increase"
                    disabled={isUnavailable}
                    className="w-12 h-10 rounded-lg bg-white border border-blue-200 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-black cursor-pointer shadow-2xs text-blue-700 active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <button
                  disabled={isUnavailable}
                  onClick={() => addItem(product)}
                  className="w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white active:scale-98"
                >
                  <ShoppingCart size={20} /> {isUnavailable ? t("outOfStock") : t("addToCart")}
                </button>
              )}

              {/* Kafolat bloklari */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="text-green-600" size={20} />
                  <span>{t("originalGuarantee")}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="text-blue-600" size={20} />
                  <span>{t("fastDelivery")}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="text-orange-500" size={20} />
                  <span>{t("qualityGuarantee")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
