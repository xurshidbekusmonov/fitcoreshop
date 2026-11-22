"use client";

import React, { useId, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { X, CheckCircle2, MapPin } from "lucide-react";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });
import { formatPrice } from "@/lib/formatPrice";
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
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const formId = useId();
  const pendingOrder = useRef<{ body: string; id: string } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(isOpen, onClose, dialogRef);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !items.length) return;
    setFormError("");
    if (!name.trim() || !/^\d{9,15}$/.test(phone.replace(/\D/g, ""))) {
      setFormError(t("orderContactInvalid"));
      return;
    }

    setIsSubmitting(true);
    try {
      const order = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: items.map(({ id, quantity }) => ({ id, quantity })),
        expectedTotal: totalPrice(),
      };
      const body = JSON.stringify(order);
      if (pendingOrder.current?.body !== body) {
        pendingOrder.current = { body, id: crypto.randomUUID() };
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, requestId: pendingOrder.current.id }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        if (result?.code === "PRICE_CHANGED") setFormError(t("orderPriceChanged"));
        else if (result?.code === "PRODUCT_UNAVAILABLE") setFormError(t("orderProductUnavailable"));
        else setFormError(t("orderError"));
        return;
      }

      pendingOrder.current = null;
      setIsSuccess(true);
      clearCart();
    } catch {
      setFormError(t("orderError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="commerce-overlay fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 bg-black/80 backdrop-blur-xs">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("checkoutTitle")}
        className="my-auto shrink-0 bg-zinc-950 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-zinc-800"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Success message */}
        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 size={48} className="text-[#D4AF37] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-white mb-1">{t("orderSuccessTitle")}</h3>
            <p className="text-xs text-zinc-400 mb-6">{t("orderSuccessDesc")}</p>
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
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-1">{t("checkoutTitle")}</h3>
            <p className="text-xs text-zinc-400 mb-4">{t("checkoutSubtitle")}</p>

            {formError && (
              <p role="alert" className="text-red-700 text-sm mb-3">{formError}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label htmlFor={`${formId}-name`} className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("nameLabel")}
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  autoComplete="name"
                  required
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor={`${formId}-phone`} className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("phoneLabel")}
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              {/* Address (optional) */}
              <div>
                <label htmlFor={`${formId}-address`} className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  {t("addressLabel")}
                </label>
                <textarea
                  id={`${formId}-address`}
                  autoComplete="street-address"
                  rows={2}
                  placeholder={t("addressPlaceholder")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#f3cc4a] transition cursor-pointer"
                >
                  <MapPin size={13} />
                  <span>{t("showOnMap")}</span>
                </button>
              </div>

              {/* Total sum */}
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wide">{t("totalSum")}</span>
                <span className="font-black text-[#D4AF37] text-sm">{formatPrice(totalPrice())} {t("currency")}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !items.length}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:opacity-50 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                {isSubmitting ? t("submittingOrder") : t("submitOrder")}
              </button>

              {/* Map picker modal */}
              {showMapPicker && (
                <MapPicker
                  onSelect={(addr) => {
                    setAddress(addr);
                    setShowMapPicker(false);
                  }}
                  onClose={() => setShowMapPicker(false)}
                />
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
