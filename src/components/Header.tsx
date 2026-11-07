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
  const { t, tCategory } = useI18n();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      document
        .getElementById("catalog-section")
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const choose = (cat: string) => {
    setSelectedCategory(cat);
    setOpen(false);
    document
      .getElementById("catalog-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="shop-header">
        <div className="container header-row">
          <button
            className="mobile-menu icon-button"
            aria-label={t("catalogMenuAria")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
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
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("catalog-section")?.scrollIntoView();
            }}
          >
            <Search size={20} />
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
      <div ref={panel} className="shop-nav">
        <nav className="container">
          <button
            className="catalog-button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
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
        {open && (
          <div className="catalog-menu container">
            <div>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => choose(cat.name)}>
                  {tCategory(cat.name)}
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
