"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { useDialog } from "@/lib/useDialog";
import { PRODUCT_GOALS, productGoal } from "@/lib/productGoals";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductCard, { Product } from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { useI18n } from "@/lib/useI18n";

const goals = [
  ["Mushak o‘stirish", "Proteinlar"],
  ["Vazn yig‘ish", "Geynerlar"],
  ["Mashq va tiklanish", "Kreatin"],
  ["Kundalik salomatlik", "Vitaminlar"],
];

export default function Home() {
  const { t, tCategory, tGoal } = useI18n();

  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [retry, setRetry] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false),
    [isCheckoutOpen, setIsCheckoutOpen] = useState(false),
    [selectedCategory, setSelectedCategory] = useState("Barchasi"),
    [searchQuery, setSearchQuery] = useState(""),
    [visibleCount, setVisibleCount] = useState(8),
    [brand, setBrand] = useState(""),
    [min, setMin] = useState(""),
    [max, setMax] = useState(""),
    [sort, setSort] = useState("default"),
    [sales, setSales] = useState(false),
    [available, setAvailable] = useState(false),
    [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useDialog(filterOpen, () => setFilterOpen(false), filterRef);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [showBrands, setShowBrands] = useState(false);
  const [draft, setDraft] = useState({
    category: "Barchasi",
    goal: "",
    brand: "",
    min: "",
    max: "",
    available: false,
  });

  useEffect(() => {
    let active = true;
    supabase
      .from("products")
      .select("*")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(true);
        else setProducts(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);

  useEffect(() => {
    const show = () => setSales(true);
    window.addEventListener("show-sales", show);
    return () => window.removeEventListener("show-sales", show);
  }, []);

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ] as string[];

  const brands = [
    ...new Map(
      products
        .filter((p) => p.brand)
        .map((p) => [p.brand!.toLowerCase().trim(), p.brand!]),
    ).values(),
  ];

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (selectedCategory === "Barchasi" || p.category === selectedCategory) &&
        (!selectedGoal || productGoal(p) === selectedGoal) &&
        (!brand ||
          p.brand?.toLowerCase().trim() === brand.toLowerCase().trim()) &&
        (!min || Number(p.price) >= Number(min)) &&
        (!max || Number(p.price) <= Number(max)) &&
        (!sales || Number(p.old_price) > Number(p.price)) &&
        (!available || (p.stock !== 0 && p.in_stock !== false)) &&
        `${p.title} ${p.brand || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
    return sort === "asc"
      ? list.sort((a, b) => a.price - b.price)
      : sort === "desc"
        ? list.sort((a, b) => b.price - a.price)
        : list;
  }, [
    products,
    selectedCategory,
    selectedGoal,
    brand,
    min,
    max,
    sales,
    available,
    searchQuery,
    sort,
  ]);

  const scroll = () =>
    document
      .getElementById("catalog-section")
      ?.scrollIntoView({ behavior: "smooth" });

  const reset = () => {
    setSelectedCategory("Barchasi");
    setSelectedGoal("");
    setBrand("");
    setMin("");
    setMax("");
    setAvailable(false);
    setSales(false);
    setSearchQuery("");
    setVisibleCount(8);
  };

  const selectCategory = (c: string) => {
    setSelectedCategory(c);
    setSelectedGoal("");
    setSales(false);
    setVisibleCount(8);
  };

  const filters = (mobile = false) => (
    <>
      <label>
        {t("filterGoal")}
        <select
          value={mobile ? draft.goal : selectedGoal}
          onChange={(e) => {
            if (mobile) setDraft({ ...draft, goal: e.target.value });
            else {
              setSelectedGoal(e.target.value);
              setVisibleCount(8);
            }
          }}
        >
          <option value="">{t("filterAllGoals")}</option>
          {PRODUCT_GOALS.map((g) => (
            <option key={g} value={g}>
              {tGoal(g)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("filterCategory")}
        <select
          value={mobile ? draft.category : selectedCategory}
          onChange={(e) => {
            if (mobile) setDraft({ ...draft, category: e.target.value });
            else selectCategory(e.target.value);
          }}
        >
          <option value="Barchasi">{t("all")}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {tCategory(c)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("filterBrand")}
        <select
          value={mobile ? draft.brand : brand}
          onChange={(e) => {
            if (mobile) setDraft({ ...draft, brand: e.target.value });
            else {
              setBrand(e.target.value);
              setVisibleCount(8);
            }
          }}
        >
          <option value="">{t("filterAllBrands")}</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>{t("filterPriceRange")}</legend>
        <div className="price-inputs">
          <input
            aria-label={t("priceFrom")}
            type="number"
            min="0"
            placeholder={t("priceFrom")}
            value={mobile ? draft.min : min}
            onChange={(e) => {
              if (mobile) setDraft({ ...draft, min: e.target.value });
              else {
                setMin(e.target.value);
                setVisibleCount(8);
              }
            }}
          />
          <input
            aria-label={t("priceTo")}
            type="number"
            min="0"
            placeholder={t("priceTo")}
            value={mobile ? draft.max : max}
            onChange={(e) => {
              if (mobile) setDraft({ ...draft, max: e.target.value });
              else {
                setMax(e.target.value);
                setVisibleCount(8);
              }
            }}
          />
        </div>
      </fieldset>
      <label className="check-label">
        <input
          type="checkbox"
          checked={mobile ? draft.available : available}
          onChange={(e) =>
            mobile
              ? setDraft({ ...draft, available: e.target.checked })
              : setAvailable(e.target.checked)
          }
        />{" "}
        {t("filterAvailable")}
      </label>
    </>
  );

  return (
    <main className="storefront">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(s) => {
          setSearchQuery(s);
          setVisibleCount(8);
        }}
        setSelectedCategory={selectCategory}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <Hero onScrollToCatalog={scroll} />
      <Features />
      <section className="container goals-section" id="goals">
        <div className="section-heading">
          <h2>{t("chooseByGoal")}</h2>
          <button onClick={scroll}>
            {t("allProducts")} <ArrowRight size={17} />
          </button>
        </div>
        <div className="goal-grid">
          {goals.map(([title, cat]) => {
            const p = products.find(
              (p) =>
                p.category === cat &&
                p.image_url &&
                !p.image_url.includes("unsplash"),
            );
            return (
              <button
                className="goal-card"
                key={cat}
                onClick={() => {
                  selectCategory("Barchasi");
                  setSelectedGoal(title);
                  scroll();
                }}
              >
                <span>{tGoal(title)}</span>
                <ArrowRight size={20} />
                {p && (
                  <img
                    src={p.image_url}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>
      <section className="container catalog-section" id="catalog-section">
        <div className="section-heading">
          <div>
            <h2>
              {selectedCategory === "Barchasi"
                ? t("sportsNutrition")
                : tCategory(selectedCategory)}
            </h2>
            <p>
              {loading
                ? t("loadingCatalog")
                : `${filtered.length} ${t("productsCount")}`}
            </p>
          </div>
          <button
            className="filter-toggle"
            onClick={() => {
              setDraft({
                category: selectedCategory,
                goal: selectedGoal,
                brand,
                min,
                max,
                available,
              });
              setFilterOpen(true);
            }}
          >
            <SlidersHorizontal size={18} /> {t("filterBtn")}
          </button>
          <label className="sort-control">
            <span className="sr-only">Saralash</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setVisibleCount(8);
              }}
            >
              <option value="default">{t("sortDefault")}</option>
              <option value="asc">{t("sortAsc")}</option>
              <option value="desc">{t("sortDesc")}</option>
            </select>
          </label>
        </div>
        {(selectedCategory !== "Barchasi" ||
          selectedGoal ||
          brand ||
          min ||
          max ||
          sales ||
          available ||
          searchQuery) && (
          <div className="active-filters">
            <span>
              {[
                selectedCategory !== "Barchasi" ? tCategory(selectedCategory) : "",
                selectedGoal ? tGoal(selectedGoal) : "",
                brand,
                min && `${min} ${t("priceFrom").toLowerCase()}`,
                max && `${max} ${t("priceTo").toLowerCase()}`,
                sales ? t("sales") : "",
                available ? t("filterAvailable") : "",
                searchQuery && `“${searchQuery}”`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <button onClick={reset}>
              {t("clearFilters")} <X size={15} />
            </button>
          </div>
        )}
        <div className="catalog-layout">
          <aside className="filter-panel">
            <h3>{t("filtersTitle")}</h3>
            {filters()}
            <button className="reset-button" onClick={reset}>
              {t("resetFilters")}
            </button>
          </aside>
          <div>
            {loading ? (
              <div className="product-grid" aria-label="Yuklanmoqda">
                {Array.from({ length: 8 }, (_, i) => (
                  <div className="product-skeleton" key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="empty-state" role="alert">
                <h3>{t("loadFailedTitle")}</h3>
                <p>{t("loadFailedDesc")}</p>
                <button
                  className="primary-action"
                  onClick={() => {
                    setLoading(true);
                    setError(false);
                    setRetry(retry + 1);
                  }}
                >
                  {t("retryBtn")}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <h3>{t("notFoundTitle")}</h3>
                <p>{t("notFoundDesc")}</p>
                <button className="primary-action" onClick={reset}>
                  {t("resetFilters")}
                </button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {filtered.slice(0, visibleCount).map((p) => (
                    <ProductCard key={p.id} item={p} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <button
                    className="load-more"
                    onClick={() => setVisibleCount(visibleCount + 8)}
                  >
                    {t("loadMore")} <ArrowRight size={17} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      {brands.length > 0 && (
        <section className="container brands-section" id="brands">
          <h2>{t("brands")}</h2>
          <div>
            {(showBrands ? brands : brands.slice(0, 12)).map((b) => (
              <button
                key={b}
                onClick={() => {
                  reset();
                  setBrand(b);
                  scroll();
                }}
              >
                {b}
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
          {brands.length > 12 && (
            <button
              className="load-more"
              onClick={() => setShowBrands(!showBrands)}
            >
              {showBrands ? t("showLess") : t("filterAllBrands")}
            </button>
          )}
        </section>
      )}
      <section className="container delivery-section" id="delivery">
        <div>
          <h2>
            {t("deliveryTitle1")}
            <br />
            {t("deliveryTitle2")}
          </h2>
          <p>{t("deliveryDesc1")}</p>
        </div>
        <div>
          <h3>{t("deliveryHeading")}</h3>
          <p>{t("deliveryDesc2")}</p>
          <button onClick={scroll}>
            {t("backToCatalog")} <ArrowRight size={17} />
          </button>
        </div>
      </section>
      <footer className="shop-footer">
        <div className="container">
          <div>
            <a href="#" className="brand">
              FITCORE<span>SHOP</span>
            </a>
            <p>{t("footerSlogan")}</p>
          </div>
          <div>
            <h3>{t("footerCatalog")}</h3>
            {goals.map(([, c]) => (
              <button
                key={c}
                onClick={() => {
                  selectCategory(c);
                  scroll();
                }}
              >
                {tCategory(c)}
              </button>
            ))}
          </div>
          <div>
            <h3>{t("footerCustomers")}</h3>
            <a href="#delivery">{t("delivery")}</a>
            <button onClick={() => setIsCartOpen(true)}>{t("cart")}</button>
            <a href="#brands">{t("brands")}</a>
          </div>
        </div>
        <div className="container footer-bottom">
          {t("footerCopyright")}
        </div>
      </footer>
      {filterOpen && (
        <div className="filter-backdrop" onClick={() => setFilterOpen(false)}>
          <div
            ref={filterRef}
            className="mobile-filter"
            role="dialog"
            aria-modal="true"
            aria-label={t("mobileFiltersTitle")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-heading">
              <h2>{t("mobileFiltersTitle")}</h2>
              <button
                aria-label="Close"
                onClick={() => setFilterOpen(false)}
              >
                <X />
              </button>
            </div>
            {filters(true)}
            <div className="filter-actions">
              <button
                onClick={() =>
                  setDraft({
                    category: "Barchasi",
                    goal: "",
                    brand: "",
                    min: "",
                    max: "",
                    available: false,
                  })
                }
              >
                {t("clearFilters")}
              </button>
              <button
                className="primary-action"
                onClick={() => {
                  setSelectedCategory(draft.category);
                  setSelectedGoal(draft.goal);
                  setBrand(draft.brand);
                  setMin(draft.min);
                  setMax(draft.max);
                  setAvailable(draft.available);
                  setVisibleCount(8);
                  setFilterOpen(false);
                }}
              >
                {t("applyFilters")}
              </button>
            </div>
          </div>
        </div>
      )}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </main>
  );
}
