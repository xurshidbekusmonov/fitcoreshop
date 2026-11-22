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
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t, tCategory } = useI18n();

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      if (!panel.current?.contains(e.target) && !e.target.closest('[aria-controls="shop-catalog-menu"]')) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  const scrollToResults = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    document.getElementById("catalog-section")?.scrollIntoView();
  };

  const handleSearch = (query: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setOpen(false);
    setSearchQuery(query);
    if (query.trim()) searchTimer.current = setTimeout(scrollToResults, 300);
  };

  const toggleMenu = (button: HTMLButtonElement) => {
    trigger.current = button;
    setOpen((current) => !current);
  };

  const choose = (cat: string) => {
    setSelectedCategory(cat);
    setOpen(false);
    scrollToResults();
  };

  return (
    <div className="shop-top">
      <header className="shop-header">
        <div className="container header-row">
          <button
            type="button"
            className="mobile-menu icon-button"
            aria-label={t("catalogMenuAria")}
            aria-expanded={open}
            aria-controls="shop-catalog-menu"
            onClick={(event) => toggleMenu(event.currentTarget)}
          >
            <Menu />
          </button>
          <Link
            className="brand"
            href="/"
            onClick={() => {
              setSelectedCategory("Barchasi");
              handleSearch("");
            }}
          >
            FITCORE<span>SHOP</span>
          </Link>
          <form
            className="shop-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              scrollToResults();
            }}
          >
            <button type="submit" aria-label={t("searchPlaceholder")}>
              <Search size={20} />
            </button>
            <input
              ref={searchInput}
              aria-label={t("searchPlaceholder")}
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onFocus={() => setOpen(false)}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button
                aria-label={t("clearSearch")}
                type="button"
                onClick={() => {
                  handleSearch("");
                  searchInput.current?.focus({ preventScroll: true });
                  requestAnimationFrame(scrollToResults);
                }}
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
            aria-expanded={open}
            aria-controls="shop-catalog-menu"
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
        <div ref={panel} id="shop-catalog-menu" className="catalog-menu container" hidden={!open}>
          <div>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => choose(cat.name)}>
                {tCategory(cat.name)}
                <ArrowRight size={16} />
              </button>
            ))}
            <Link className="mobile-admin-link" href="/admin">{t("admin")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
