"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/useI18n";

export default function Hero({
  onScrollToCatalog,
}: {
  onScrollToCatalog: () => void;
}) {
  const { t } = useI18n();

  return (
    <section className="container hero-wrap">
      <div className="sport-hero campaign-hero">
        <img
          className="campaign-art"
          src="/fitcore-training-banner.webp"
          alt=""
          width={2172}
          height={724}
          fetchPriority="high"
        />
        <div className="hero-copy">
          <h1>
            {t("heroTitleLine1")}
            <br />
            <span>{t("heroTitleLine2")}</span>
          </h1>
          <p>{t("heroSubtitle")}</p>
          <button className="primary-action" onClick={onScrollToCatalog}>
            {t("viewCatalog")} <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
