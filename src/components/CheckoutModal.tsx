"use client";

import React, { useState, useRef } from "react";
import { X, CheckCircle2, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { supabase } from "@/lib/supabase";
import { useDialog } from "@/lib/useDialog";
import { useCartStore } from "@/lib/cartStore";
import { useI18n } from "@/lib/useI18n";

export default function CheckoutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, totalPrice, clearCart } = useCartStore();
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(isOpen, onClose, dialogRef);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !items.length) return;
    setFormError("");
    if (!name || phone.length < 9 || !address) {
      alert(t("fillAllFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from("orders").insert([
        {
          customer_name: name,
          customer_phone: phone,
          shipping_address: address,
          total_amount: totalPrice(),
          items: items,
        },
      ]);

      if (dbError) {
        console.warn("Baza xatoligi:", dbError.message);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          items,
          totalAmount: totalPrice(),
        }),
      });

      if (!res.ok) {
        throw new Error("Telegram bildirishnomasi yetib bormadi");
      }

      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      setFormError(`${t("orderError")} ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="commerce-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("checkoutTitle")}
        className="bg-zinc-950 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-zinc-800"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 cursor-pointer"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-white mb-1">
              {t("orderSuccessTitle")}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              {t("orderSuccessDesc")}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="bg-[#D4AF37] hover:bg-[#C59B27] text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
            >
              {t("backToStore")}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-1">
              {t("checkoutTitle")}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {t("checkoutSubtitle")}
            </p>

            {formError && (
              <p role="alert" className="text-red-700 text-sm mb-3">
                {formError}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("nameLabel")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("phoneLabel")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("addressLabel")}
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder={t("addressPlaceholder")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
                <button
                  type="button"
                  onClick={() => {
                    const query = address.trim();
                    const url = query
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
                      : "https://www.google.com/maps";
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#f3cc4a] transition cursor-pointer"
                >
                  <MapPin size={13} />
                  <span>{t("showOnMap")}</span>
                </button>
              </div>

              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wide">
                  {t("totalSum")}
                </span>
                <span className="font-black text-[#D4AF37] text-sm">
                  {formatPrice(totalPrice())} {t("currency")}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !items.length}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:opacity-50 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                {isSubmitting ? t("submittingOrder") : t("submitOrder")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
