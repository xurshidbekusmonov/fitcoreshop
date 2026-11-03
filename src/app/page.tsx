'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, Search, Phone, ShieldCheck, Truck, RefreshCw, 
  Flame, ArrowRight, X, Trash2, Plus, Minus, CheckCircle2, ShieldAlert,
  Star, Award, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';

// 1. Tepadagi Savatcha tugmasi (Optimum Gold Accent)
function CartButton({ onOpen }: { onOpen: () => void }) {
  const totalCount = useCartStore((state) => state.totalCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalCount() : 0;

  return (
    <button
      onClick={onOpen}
      className="relative flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C59B27] text-black px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
    >
      <ShoppingCart size={16} className="text-black stroke-[2.5]" />
      <span className="hidden sm:inline">Savatcha</span>
      {count > 0 && (
        <span className="bg-black text-[#D4AF37] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

// 2. Tovar kartochkasi (Optimum Nutrition Usulida)
function ProductCard({ item }: { item: any }) {
  const addItem = useCartStore((state) => state.addItem);

  const discountPercent = item.old_price && item.old_price > item.price
    ? Math.round(((item.old_price - item.price) / item.old_price) * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl border border-zinc-200 hover:border-black p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between relative">
      <div>
        {/* Nishonlar */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {item.badge && (
            <span className="bg-black text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider shadow-sm">
              {item.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Tovar rasmi */}
        <Link href={`/product/${item.id}`} className="block overflow-hidden rounded-lg bg-[#f8f8f8] p-4 mb-3 group-hover:bg-zinc-100 transition">
          <div className="h-48 w-full flex items-center justify-center">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'}
              alt={item.title}
              className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Brend & Yulduzcha */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-zinc-400">
            {item.brand || 'OPTIMUM'}
          </span>
          <div className="flex items-center text-[#D4AF37] text-xs gap-0.5">
            <Star size={13} className="fill-[#D4AF37]" />
            <span className="text-zinc-800 font-extrabold text-xs ml-0.5">4.9</span>
          </div>
        </div>

        {/* Sarlavha */}
        <Link href={`/product/${item.id}`}>
          <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-[#C59B27] transition">
            {item.title}
          </h3>
        </Link>

        {/* Xususiyatlar */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500">
          <span className="bg-zinc-100 px-2 py-0.5 rounded font-semibold text-zinc-700">
            {item.flavor || 'Standart'}
          </span>
          <span>•</span>
          <span className="font-bold text-zinc-700">{item.weight_volume || '1 dona'}</span>
        </div>
      </div>

      {/* Narx va Savatchaga tugmasi */}
      <div className="pt-4 mt-3 border-t border-zinc-100">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-black text-black tracking-tight">
            {Number(item.price).toLocaleString('uz-UZ')} <span className="text-xs font-bold text-zinc-500">so‘m</span>
          </span>
          {item.old_price && (
            <span className="text-xs text-zinc-400 line-through font-semibold">
              {Number(item.old_price).toLocaleString('uz-UZ')} so‘m
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(item)}
          className="w-full bg-black hover:bg-[#D4AF37] text-white hover:text-black py-2.5 rounded-md font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
        >
          <ShoppingCart size={14} className="stroke-[2.5]" /> Savatchaga qo‘shish
        </button>
      </div>
    </div>
  );
}

// 3. Savatcha oynasi (Drawer)
function CartDrawer({ 
  isOpen, 
  onClose, 
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCheckout: () => void; 
}) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-4 bg-black text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">Savatcha</h2>
              <p className="text-[11px] text-[#D4AF37] font-semibold">{items.length} xil mahsulot</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-20 text-zinc-400">
                <ShoppingCart size={44} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm font-bold text-zinc-800 uppercase tracking-wide">Savatchangiz bo‘sh</p>
                <p className="text-xs mt-1 text-zinc-400">O‘zingizga yoqqan mahsulotlarni tanlang</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-zinc-100 pb-3 items-center">
                  <div className="w-16 h-16 bg-[#f8f8f8] rounded-md p-1 flex items-center justify-center shrink-0 border">
                    <img src={item.image_url} alt={item.title} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-zinc-900 uppercase truncate">{item.title}</h4>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">{item.weight_volume || item.flavor}</span>
                    <span className="text-xs font-black text-black mt-1 block">
                      {item.price.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-zinc-300 rounded bg-white">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-zinc-100">
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-zinc-100">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-zinc-400 hover:text-red-600 p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-zinc-200 bg-zinc-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider">Jami to‘lov:</span>
                <span className="text-xl font-black text-black">
                  {totalPrice().toLocaleString('uz-UZ')} <span className="text-xs font-bold text-zinc-500">so‘m</span>
                </span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] active:scale-98 text-black py-3 rounded-md font-black text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                Buyurtmani tasdiqlash <ArrowRight size={16} />
              </button>
              <button onClick={clearCart} className="w-full text-center text-[11px] text-zinc-400 hover:text-red-600 mt-2 py-1">
                Savatchani tozalash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Buyurtma oynasi
function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 9 || !address) {
      alert('Iltimos, barcha maydonlarni to‘ldiring');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from('orders').insert([
        {
          customer_name: name,
          customer_phone: phone,
          shipping_address: address,
          total_amount: totalPrice(),
          items: items,
        },
      ]);

      if (dbError) {
        console.warn('Baza xatoligi:', dbError.message);
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address,
          items,
          totalAmount: totalPrice(),
        }),
      });

      if (!res.ok) {
        throw new Error('Telegram bildirishnomasi yetib bormadi');
      }

      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl relative border border-zinc-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black p-1.5"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-black mb-1">Buyurtma Qabul Qilindi!</h3>
            <p className="text-xs text-zinc-500 mb-6">
              Menejerlarimiz tez orada siz bilan bog‘lanishadi.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="bg-black hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded text-xs uppercase"
            >
              Do‘konga qaytish
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-black mb-1">Buyurtmani rasmiylashtirish</h3>
            <p className="text-xs text-zinc-500 mb-4">Yetkazib berish ma'lumotlarini to‘ldiring</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Ism va familiya</label>
                <input
                  type="text"
                  required
                  placeholder="Misol: Sardor Aliyev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-zinc-300 rounded p-2.5 text-xs outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Telefon raqam</label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-zinc-300 rounded p-2.5 text-xs outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Yetkazib berish manzili</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Shahar, tuman, ko‘cha va uy raqami"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-zinc-300 rounded p-2.5 text-xs outline-none focus:border-black transition"
                />
              </div>

              <div className="bg-zinc-100 p-3 rounded flex justify-between items-center text-xs">
                <span className="text-zinc-600 font-bold uppercase tracking-wide">Jami summa:</span>
                <span className="font-black text-black text-sm">{totalPrice().toLocaleString('uz-UZ')} so‘m</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:opacity-50 text-black font-black py-3 rounded text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Bo'limlar ro'yxati
const CATEGORIES = [
  { id: 'all', name: 'Barchasi', icon: '⚡' },
  { id: 'Proteinlar', name: 'Proteinlar', icon: '🥛' },
  { id: 'Geynerlar', name: 'Geynerlar', icon: '🔋' },
  { id: 'Kreatin', name: 'Kreatin', icon: '💪' },
  { id: 'BCAA & Aminolar', name: 'BCAA & Aminolar', icon: '🧬' },
  { id: 'Energiya & Pump', name: 'Energiya & Pump', icon: '🔥' },
  { id: 'Vitaminlar', name: 'Vitaminlar', icon: '💊' },
  { id: 'Yog\' erituvchilar', name: 'Yog‘ erituvchilar', icon: '🎯' },
  { id: 'Tiklanish & Kuch', name: 'Tiklanish & Kuch', icon: '🛡️' },
];

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
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (data) setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Barchasi' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-zinc-900 font-sans">
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

      {/* Top Banner (Optimum Gold Accent Strip) */}
      <div className="bg-[#111111] text-zinc-300 text-[11px] py-2 px-4 border-b border-zinc-800 tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
            <span>100% Original Sifat Kafolati • Butun O‘zbekiston bo‘ylab yetkazib berish</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-zinc-400">09:00 - 20:00</span>
            <a href="tel:+998781130219" className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white transition font-bold">
              <Phone size={12} /> +998 78 113 02 19
            </a>
          </div>
        </div>
      </div>

      {/* Optimum Black Header */}
      <header className="bg-black text-white sticky top-0 z-40 shadow-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
          <Link 
            href="/"
            onClick={() => { setSelectedCategory('Barchasi'); setSearchQuery(''); }}
            className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white flex items-center gap-1"
          >
            FITCORE<span className="text-[#D4AF37] not-italic">SHOP</span>
          </Link>

          {/* Qidiruv darchasi (Dark input) */}
          <div className="flex-1 max-w-lg relative hidden sm:block">
            <input
              type="text"
              placeholder="Mahsulot yoki brendlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] text-white px-4 py-2.5 pl-10 pr-9 rounded-md text-xs outline-none transition placeholder:text-zinc-500"
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

          {/* O'ng taraf: Admin & Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-[#D4AF37] p-2 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <ShieldAlert size={16} />
              <span className="hidden md:inline">Admin</span>
            </Link>
            <CartButton onOpen={() => setIsCartOpen(true)} />
          </div>
        </div>
      </header>

      {/* Hero Section (Optimum Bold Black & Gold Banner) */}
      <section className="relative overflow-hidden bg-black text-white py-16 md:py-24 px-4 sm:px-6 border-b border-zinc-800">
        {/* Orqa fon nur effekti */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded text-xs font-black uppercase text-[#D4AF37] mb-4 tracking-widest">
              <Award size={14} /> Haqiqiy Standart
            </div>
            <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tight leading-none mb-4">
              GOLD STANDARD <br />
              <span className="text-[#D4AF37] not-italic">NATIJAGA ERISHING</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mb-8 leading-relaxed max-w-lg font-normal">
              Eng yuqori tozalikdagi proteinlar, kreatinlar va original vitaminlar. Chempionlar tanlovi endi O‘zbekistonda.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#D4AF37] hover:bg-[#C59B27] text-black font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-md transition shadow-lg cursor-pointer"
              >
                Katalogni ko‘rish
              </button>
              <button 
                onClick={() => setSelectedCategory('Proteinlar')}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-wider text-xs px-7 py-3.5 rounded-md transition cursor-pointer"
              >
                Proteinlar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Afzalliklar (Optimum Qora-Oltin Kartochkalar) */}
      <section className="bg-white border-b border-zinc-200 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
              <Truck size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">Tezkor yetkazish</h4>
              <p className="text-[11px] text-zinc-500 font-medium">Butun O‘zbekiston bo‘ylab 24 soat ichida</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">100% Original</h4>
              <p className="text-[11px] text-zinc-500 font-medium">Rasmiy laboratoriya tekshiruvidan o‘tgan</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
              <RefreshCw size={22} className="text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">Ishonchli to‘lov</h4>
              <p className="text-[11px] text-zinc-500 font-medium">Payme, Click yoki qabul qilganda naqd</p>
            </div>
          </div>
        </div>
      </section>

      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Kategoriyalar Menyusi */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Toifalar bo‘yicha tanlang</h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-black text-[#D4AF37] border-black shadow-md'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Mahsulotlar ro'yxati */}
        <section>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase tracking-tight text-black">
                {selectedCategory === 'Barchasi' ? 'Barcha tovarlar' : selectedCategory}
              </h2>
              <span className="text-xs bg-black text-[#D4AF37] px-2.5 py-0.5 rounded font-black">
                {filteredProducts.length} ta
              </span>
            </div>

            {selectedCategory !== 'Barchasi' && (
              <button
                onClick={() => setSelectedCategory('Barchasi')}
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition cursor-pointer"
              >
                Barchasini ko‘rsatish
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-24 text-zinc-400 text-xs uppercase font-bold tracking-widest">
              Mahsulotlar yuklanmoqda...
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="bg-black hover:bg-[#D4AF37] text-white hover:text-black font-black uppercase tracking-wider px-8 py-3.5 rounded text-xs transition-all shadow-md cursor-pointer"
                  >
                    Yana ko‘rsatish (+8 ta)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white border border-zinc-200 rounded-xl p-6">
              <p className="text-black font-extrabold text-sm uppercase tracking-wide mb-1">
                Ushbu bo‘limda tovar topilmadi
              </p>
              <p className="text-xs text-zinc-400 mb-5">
                Boshqa bo‘limni tanlang yoki qidiruv so‘zini o‘zgartiring.
              </p>
              <button
                onClick={() => { setSelectedCategory('Barchasi'); setSearchQuery(''); }}
                className="bg-black text-[#D4AF37] font-black uppercase tracking-wider text-xs px-5 py-2.5 rounded transition cursor-pointer"
              >
                Barcha tovarlarga qaytish
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Optimum Black Footer */}
      <footer className="bg-black text-zinc-400 py-12 px-4 sm:px-6 mt-20 text-xs border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="text-xl font-black italic tracking-tighter text-white">
              FITCORE<span className="text-[#D4AF37] not-italic">SHOP</span>
            </span>
            <p className="mt-1 text-zinc-500 font-medium">© 2026 FITCORE SHOP. Barcha huquqlar himoyalangan.</p>
          </div>
          <div className="flex gap-6 font-bold uppercase tracking-wider text-[11px] text-zinc-300">
            <span className="hover:text-[#D4AF37] cursor-pointer">Sifat Kafolati</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">Yetkazib Berish</span>
            <span className="hover:text-[#D4AF37] cursor-pointer">Maxfiylik Siyosati</span>
          </div>
        </div>
      </footer>
    </div>
  );
}