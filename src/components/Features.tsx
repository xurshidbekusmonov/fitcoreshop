"use client";

import { Truck, PackageCheck, Layers } from "lucide-react";
import { useI18n } from "@/lib/useI18n";

export default function Features() {
  const { t } = useI18n();

  return (
    <section className="container service-row">
      <div>
        <PackageCheck />
        <span>{t("featCatalog")}</span>
      </div>
      <div>
        <Truck />
        <span>{t("featDelivery")}</span>
      </div>
      <div>
        <Layers />
        <span>{t("featChoice")}</span>
      </div>
    </section>
  );
}
