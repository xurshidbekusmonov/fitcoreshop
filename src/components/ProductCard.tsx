"use client";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useSyncExternalStore } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useI18n } from "@/lib/useI18n";

export type Product = {
  id: string;
  title: string;
  brand?: string;
  category?: string;
  goal?: string | null;
  price: number;
  old_price?: number;
  image_url?: string;
  flavor?: string;
  weight_volume?: string;
  badge?: string;
  stock?: number;
  in_stock?: boolean;
};

const subscribe = () => () => {};

export default function ProductCard({ item }: { item: Product }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { items, addItem, updateQuantity } = useCartStore();
  const { t, tCategory } = useI18n();

  const quantity = mounted
    ? items.find((i) => i.id === item.id)?.quantity || 0
    : 0;
  const unavailable = item.stock === 0 || item.in_stock === false;

  return (
    <article className="product-card">
      <Link className="product-image" href={`/product/${item.id}`}>
        <img
          src={item.image_url || "/product-placeholder.svg"}
          alt={item.title}
          loading="lazy"
          width={320}
          height={320}
          onError={(e) => {
            e.currentTarget.src = "/product-placeholder.svg";
          }}
        />
        {item.badge && <span className="product-badge">{item.badge}</span>}
      </Link>
      <div className="product-brand">{item.brand}</div>
      <Link href={`/product/${item.id}`}>
        <h3>{item.title}</h3>
      </Link>
      <p className="product-variant">
        {[item.weight_volume, item.flavor].filter(Boolean).join(" · ") ||
          (item.category ? tCategory(item.category) : "")}
      </p>
      <div className="product-purchase">
        <div className="price">
          {formatPrice(item.price)} <small>{t("currency")}</small>
        </div>
        {Number(item.old_price) > Number(item.price) && (
          <del>
            {formatPrice(item.old_price)} {t("currency")}
          </del>
        )}
        {quantity > 0 ? (
          <div className="quantity-control">
            <button
              aria-label={`${item.title}: -`}
              onClick={() => updateQuantity(item.id, -1)}
            >
              <Minus size={17} />
            </button>
            <span aria-live="polite">
              <Check size={14} /> {quantity} {t("inCart")}
            </span>
            <button
              aria-label={`${item.title}: +`}
              disabled={unavailable}
              onClick={() => updateQuantity(item.id, 1)}
            >
              <Plus size={17} />
            </button>
          </div>
        ) : (
          <button
            className="add-button"
            disabled={unavailable}
            onClick={() => addItem(item)}
          >
            <ShoppingCart size={18} />
            {unavailable ? t("outOfStock") : t("addToCart")}
          </button>
        )}
      </div>
    </article>
  );
}
