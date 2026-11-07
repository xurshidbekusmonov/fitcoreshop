"use client";

import { useEffect, useState } from "react";
import { useLanguageStore, Language } from "./languageStore";
import {
  translations,
  TranslationKey,
  translateCategory,
  translateGoal,
} from "./translations";

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang: Language = mounted ? language : "uz";

  const t = (key: TranslationKey): string => {
    return translations[currentLang][key] || translations["uz"][key] || key;
  };

  const tCategory = (cat: string) => translateCategory(cat, currentLang);
  const tGoal = (goal: string) => translateGoal(goal, currentLang);

  return {
    lang: currentLang,
    setLanguage,
    t,
    tCategory,
    tGoal,
    mounted,
  };
}
