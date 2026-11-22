"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X, Menu, ArrowRight } from "lucide-react";
import CartButton from "./CartButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { CATEGORIES } from "./Categories";
import { useI18n } from "@/lib/useI18n";

export default function Header({
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
  onOpenCart,
}: {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  setSelectedCategory: (s: string) => void;
  onOpenCart: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const { t, tCategory } = useI18n();

  useEffect(() => {
    if (!open) return;

    const close = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (
        !menu.current?.contains(event.target) &&
        !event.target.closest('[aria-controls="shop-catalog-menu"]')
      ) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuTrigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const toggleMenu = (button: HTMLButtonElement) => {
    menuTrigger.current = button;
    setOpen((current) => !current);
  };

  const choose = (cat: string) => {
    setSelectedCategory(cat);
    setOpen(false);
    document.getElementById("catalog-section")?.scrollIntoView();
  };

  return (
    <>
      <header className="shop-header">
        <div className="container header-row">
          <button
            type="button"
            className="mobile-menu icon-button"
            aria-label={t("catalogMenuAria")}
            aria-controls="shop-catalog-menu"
            aria-expanded={open}
            onClick={(event) => toggleMenu(event.currentTarget)}
          >
            <Menu />
          </button>
          <Link
            className="brand"
            href="/"
            onClick={() => {
              setSelectedCategory("Barchasi");
              setSearchQuery("");
            }}
          >
            FITCORE<span>SHOP</span>
          </Link>
          <form
            className="shop-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("catalog-section")?.scrollIntoView();
            }}
          >
            <button type="submit" aria-label={t("searchPlaceholder")}>
              <Search size={20} />
            </button>
            <input
              aria-label={t("searchPlaceholder")}
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                aria-label={t("clearSearch")}
                type="button"
                onClick={() => setSearchQuery("")}
              >
                <X size={18} />
              </button>
            )}
          </form>
          <LanguageSwitcher />
          <Link className="admin-link" href="/admin">
            {t("admin")}
          </Link>
          <CartButton onOpen={onOpenCart} />
        </div>
      </header>
      <div className="shop-nav">
        <nav className="container">
          <button
            type="button"
            className="catalog-button"
            aria-controls="shop-catalog-menu"
            aria-expanded={open}
            onClick={(event) => toggleMenu(event.currentTarget)}
          >
            <Menu size={20} /> {t("catalog")}
          </button>
          <a href="#goals">{t("byGoal")}</a>
          <a href="#brands">{t("brands")}</a>
          <button
            onClick={() => {
              choose("Barchasi");
              window.dispatchEvent(new Event("show-sales"));
            }}
          >
            {t("sales")}
          </button>
          <a href="#delivery">{t("delivery")}</a>
          <span className="nav-note">{t("navSlogan")}</span>
        </nav>
        <div
          ref={menu}
          id="shop-catalog-menu"
          className="catalog-menu container"
          hidden={!open}
        >
          <div>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => choose(cat.name)}>
                {tCategory(cat.name)}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
