"use client";

import React, { useState, useEffect } from "react";
import { PRODUCT_GOALS, productGoal } from "@/lib/productGoals";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Pencil,
  X,
  MapPin,
  Phone,
  Lock,
  LogOut,
  KeyRound,
  UserCheck,
  Check,
} from "lucide-react";

const CATEGORIES = [
  "Proteinlar",
  "Geynerlar",
  "Kreatin",
  "BCAA & Aminolar",
  "Energiya & Pump",
  "Vitaminlar",
  "Yog‘ erituvchilar",
  "Tiklanish & Kuch",
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [goalColumnAvailable,setGoalColumnAvailable]=useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Tahrirlanayotgan tovar ID si (agar null bo'lsa yangi tovar qo'shish rejimida bo'ladi)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Tovar formasi
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    goal: "",
    category: "Proteinlar",
    price: "",
    old_price: "",
    flavor: "",
    weight_volume: "",
    badge: "",
    image_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (active && data.authenticated) {
          setIsAuthenticated(true);
          loadProducts();
          loadOrders();
        }
      })
      .catch(() =>
        setAuthError("Kirishni tekshirib bo‘lmadi. Qayta urinib ko‘ring."),
      );
    return () => {
      active = false;
    };
  }, []);
  const [loggingIn, setLoggingIn] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsAuthenticated(true);
      setPasswordInput("");
      loadProducts();
      loadOrders();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Kirishda xatolik");
    } finally {
      setLoggingIn(false);
    }
  };
  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setIsAuthenticated(false);
    setLoginInput("");
    setPasswordInput("");
  };

  async function loadProducts() {
    const goalCheck=await supabase.from("products").select("goal").limit(1);
    setGoalColumnAvailable(!goalCheck.error);
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setProducts(data);
    setLoadingProducts(false);
  }

  async function loadOrders() {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setOrders(data);
    setLoadingOrders(false);
  }

  // Formani tozalash
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      brand: "",
      goal: "",
      category: "Proteinlar",
      price: "",
      old_price: "",
      flavor: "",
      weight_volume: "",
      badge: "",
      image_url: "",
    });
  };

  // Tahrirlashni boshlash (ma'lumotlarni formaga joylash)
  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      brand: item.brand || "",
      goal: item.goal || "",
      category: item.category || "Proteinlar",
      price: item.price ? String(item.price) : "",
      old_price: item.old_price ? String(item.old_price) : "",
      flavor: item.flavor || "",
      weight_volume: item.weight_volume || "",
      badge: item.badge || "",
      image_url: item.image_url || "",
    });
    // Formani ko'rish uchun sahifani yuqoriga surish
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Saqlash (Yangi qo'shish yoki Mavjudini yangilash)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Mahsulot nomi va narxini kiritish shart!");
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    const payload = {
      title: formData.title,
      brand: formData.brand.trim() || "Standart",
      ...(formData.goal || products.some((p) => "goal" in p)
        ? { goal: formData.goal || null }
        : {}),
      category: formData.category,
      price: Number(formData.price),
      old_price: formData.old_price ? Number(formData.old_price) : null,
      flavor: formData.flavor || "Standart",
      weight_volume: formData.weight_volume || "1 dona",
      badge: formData.badge || null,
      image_url: formData.image_url || "/product-placeholder.svg",
    };

    if (editingId) {
      // 1. UPDATE - Mavjud tovarni yangilash
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(
          error.message.includes("goal")
            ? "Maqsad ustuni hali bazaga qo‘shilmagan. SQL migratsiyasini bajaring."
            : "Yangilashda xatolik: " + error.message,
        );
      } else {
        alert("Mahsulot muvaffaqiyatli yangilandi!");
        resetForm();
        loadProducts();
      }
    } else {
      // 2. INSERT - Yangi tovar qo'shish
      const { error } = await supabase.from("products").insert([payload]);

      if (error) {
        alert("Qo‘shishda xatolik: " + error.message);
      } else {
        alert("Tovar muvaffaqiyatli qo‘shildi!");
        resetForm();
        loadProducts();
      }
    }
    setSubmitting(false);
  };

  // Tovarni o'chirish
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Haqiqatan ham bu mahsulotni o‘chirmoqchimisiz?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } else {
      alert("O‘chirishda xatolik: " + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock size={24} />
            </div>
            <Link href="/" className="brand">
              FITCORE<span>SHOP</span>
            </Link>
            <h2 className="text-xl font-bold text-gray-900">
              Admin Panelga kirish
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Davom etish uchun login va parolni kiriting
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-lg mb-4 text-center font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Login
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 pl-9"
                />
                <UserCheck
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 pl-9"
                />
                <KeyRound
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow cursor-pointer mt-2"
            >
              {loggingIn ? "Kirilmoqda…" : "Tizimga kirish"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-gray-100 text-gray-800">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold tracking-wide">
          FITCORE<span className="text-orange-500">SHOP</span> Admin Panel
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Package size={17} /> Mahsulotlar ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ShoppingBag size={17} /> Buyurtmalar ({orders.length})
            </button>
          </div>
          <button
            onClick={handleLogout}
            title="Chiqish"
            className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <LogOut size={15} /> Chiqish
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* ===================== MAHSULOTLAR BO'LIMI ===================== */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tovar qo'shish / tahrirlash formasi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  {editingId ? (
                    <>
                      <Pencil size={18} className="text-orange-500" /> Tovarni
                      tahrirlash
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="text-blue-600" /> Yangi tovar
                      qo‘shish
                    </>
                  )}
                </h2>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"
                  >
                    <X size={14} /> Bekor qilish
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Gold Standard 100% Whey"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-gray-600 mb-1"
                    htmlFor="product-goal"
                  >
                    Maqsad
                  </label>
                  <select
                    id="product-goal"
                    disabled={!goalColumnAvailable}
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
                  >
                    <option value="">Kategoriyaga mos avtomatik</option>
                    {PRODUCT_GOALS.map((goal) => (
                      <option key={goal}>{goal}</option>
                    ))}
                  </select>
                  {!goalColumnAvailable && <p className="text-xs text-amber-800 mt-2">Maqsadni alohida saqlash uchun baza sozlanishi kutilmoqda. Hozircha kategoriya bo‘yicha ishlaydi.</p>}
                  <datalist id="product-brands">
                    {Array.from(
                      new Set(products.map((p) => p.brand).filter(Boolean)),
                    ).map((brand) => (
                      <option key={String(brand)} value={String(brand)} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Brendi
                    </label>
                    <input
                      type="text"
                      list="product-brands"
                      placeholder="Brendni tanlang yoki yangi kiriting"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Kategoriya
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Asosiy narx (so‘m) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="450000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Eski narx (aksiya)
                    </label>
                    <input
                      type="number"
                      placeholder="500000"
                      value={formData.old_price}
                      onChange={(e) =>
                        setFormData({ ...formData, old_price: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Ta'mi / Ta'rif
                    </label>
                    <input
                      type="text"
                      placeholder="Shokolad"
                      value={formData.flavor}
                      onChange={(e) =>
                        setFormData({ ...formData, flavor: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Vazni / Hajmi
                    </label>
                    <input
                      type="text"
                      placeholder="2.27 kg (5 lbs)"
                      value={formData.weight_volume}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weight_volume: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Nishon (Badge)
                    </label>
                    <input
                      type="text"
                      placeholder="HIT / Yangi / Top"
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Rasm URL
                    </label>
                    <input
                      type="text"
                      inputMode="url"
                      placeholder="https://..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition shadow cursor-pointer text-white disabled:bg-gray-400 ${
                      editingId
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {submitting
                      ? "Saqlanmoqda..."
                      : editingId
                        ? "O‘zgarishlarni saqlash"
                        : "Bazaga qo‘shish"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Tovarlar ro'yxati jadvali */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">
                  Mavjud tovarlar ro‘yxati
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">
                  Jami: {products.length} ta
                </span>
              </div>

              {loadingProducts ? (
                <div className="p-12 text-center text-gray-400">
                  Tovarlar yuklanmoqda...
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  Hozircha hech qanday tovar yo‘q.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b">
                        <th className="p-3">Tovar</th>
                        <th className="p-3">Kategoriya</th>
                        <th className="p-3">Brend / Maqsad</th>
                        <th className="p-3">Narxi</th>
                        <th className="p-3 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50/70 transition ${
                            editingId === item.id ? "bg-orange-50/50" : ""
                          }`}
                        >
                          <td className="p-3 flex items-center gap-3">
                            <img loading="lazy"
                              src={item.image_url}
                              alt=""
                              className="w-10 h-10 object-contain rounded border p-1 bg-white shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {item.brand} • {item.weight_volume}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{item.category}</td>
                          <td className="p-3 text-gray-600">
                            <strong>{item.brand}</strong>
                            <br />
                            {productGoal(item) || "—"}
                          </td>
                          <td className="p-3 font-bold text-blue-700 whitespace-nowrap">
                            {Number(item.price).toLocaleString("uz-UZ")} so‘m
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              {/* Tahrirlash tugmasi */}
                              <button
                                onClick={() => handleStartEdit(item)}
                                title="Tahrirlash"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg cursor-pointer transition"
                              >
                                <Pencil size={16} />
                              </button>
                              {/* O'chirish tugmasi */}
                              <button
                                onClick={() => handleDeleteProduct(item.id)}
                                title="O‘chirish"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg cursor-pointer transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== BUYURTMALAR BO'LIMI ===================== */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Kelib tushgan buyurtmalar
              </h3>
              <button
                onClick={loadOrders}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
              >
                Yangilash
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-gray-400">
                Buyurtmalar yuklanmoqda...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                Hozircha yangi buyurtmalar kelib tushmadi.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 hover:bg-gray-50/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold text-gray-400">
                          Buyurtma #{order.id}
                        </span>
                        <h4 className="font-bold text-base text-gray-900 mt-0.5">
                          {order.customer_name}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-gray-400 block">
                          Jami summa:
                        </span>
                        <span className="text-lg font-extrabold text-blue-700">
                          {Number(order.total_amount).toLocaleString("uz-UZ")}{" "}
                          so‘m
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          {order.customer_phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{order.shipping_address}</span>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
                        Buyurtma tarkibi:
                      </p>
                      <div className="space-y-1.5">
                        {Array.isArray(order.items) &&
                          order.items.map((prod: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-xs text-gray-700"
                            >
                              <span>
                                {prod.title}{" "}
                                <b className="text-blue-600">
                                  x{prod.quantity}
                                </b>
                              </span>
                              <span className="font-semibold">
                                {(prod.price * prod.quantity).toLocaleString(
                                  "uz-UZ",
                                )}{" "}
                                so‘m
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
