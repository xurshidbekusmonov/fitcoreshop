"use client";

import React from "react";
import { useI18n } from "@/lib/useI18n";

export default function LanguageSwitcher() {
  const { lang, setLanguage, mounted } = useI18n();
  const currentLang = mounted ? lang : "uz";

  return (
    <div
      role="group"
      aria-label="Tilni tanlash / Выбор языка"
      className="language-switcher inline-flex items-center rounded-xl bg-zinc-100 p-1 border border-zinc-200 text-xs font-bold shrink-0 shadow-2xs"
    >
      <button
        type="button"
        aria-pressed={currentLang === "uz"}
        onClick={() => setLanguage("uz")}
        className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer ${
          currentLang === "uz"
            ? "bg-[#D4AF37] text-black shadow-xs"
            : "text-zinc-600 hover:text-black hover:bg-zinc-200/60"
        }`}
      >
        UZ
      </button>
      <button
        type="button"
        aria-pressed={currentLang === "ru"}
        onClick={() => setLanguage("ru")}
        className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer ${
          currentLang === "ru"
            ? "bg-[#D4AF37] text-black shadow-xs"
            : "text-zinc-600 hover:text-black hover:bg-zinc-200/60"
        }`}
      >
        RU
      </button>
    </div>
  );
}
