import { Language } from "./languageStore";

export const translations = {
  uz: {
    // Header & Navigation
    searchPlaceholder: "Mahsulot yoki brendni qidirish",
    catalog: "Katalog",
    byGoal: "Maqsad bo‘yicha",
    brands: "Brendlar",
    sales: "Aksiyalar",
    delivery: "Yetkazib berish",
    navSlogan: "Kuchli maqsad. To‘g‘ri tanlov.",
    admin: "Admin",
    cart: "Savatcha",
    all: "Barchasi",
    clearSearch: "Qidiruvni tozalash",
    catalogMenuAria: "Katalog menyusi",

    // Hero
    heroTitleLine1: "Har bir mashqqa",
    heroTitleLine2: "munosib quvvat.",
    heroSubtitle: "Maqsadingizga mos sport ozuqalari.",
    viewCatalog: "Katalogni ko‘rish",

    // Features
    featCatalog: "Sport ozuqalari katalogi",
    featDelivery: "O‘zbekiston bo‘ylab yetkazish",
    featChoice: "Maqsadingizga mos tanlov",

    // Goals Section
    chooseByGoal: "Maqsadingiz bo‘yicha tanlang",
    allProducts: "Barcha mahsulotlar",
    goalMuscle: "Mushak o‘stirish",
    goalMass: "Vazn yig‘ish",
    goalRecovery: "Mashq va tiklanish",
    goalHealth: "Kundalik salomatlik",

    // Catalog & Filters
    sportsNutrition: "Sport ozuqalari",
    loadingCatalog: "Katalog yuklanmoqda…",
    productsCount: "ta mahsulot",
    filterBtn: "Filtr",
    filtersTitle: "Mahsulotlarni tanlash",
    mobileFiltersTitle: "Filtrlar",
    sortDefault: "Katalog tartibida",
    sortAsc: "Narx: arzonidan",
    sortDesc: "Narx: qimmatidan",
    filterGoal: "Maqsad",
    filterAllGoals: "Barcha maqsadlar",
    filterCategory: "Kategoriya",
    filterBrand: "Brend",
    filterAllBrands: "Barcha brendlar",
    filterPriceRange: "Narx oralig‘i, so‘m",
    priceFrom: "Dan",
    priceTo: "Gacha",
    filterAvailable: "Mavjud mahsulotlar",
    clearFilters: "Tozalash",
    resetFilters: "Filtrlarni tozalash",
    applyFilters: "Natijalarni ko‘rsatish",
    loadMore: "Ko‘proq ko‘rsatish",
    showLess: "Kamroq ko‘rsatish",

    // Empty & Error states
    loadFailedTitle: "Katalogni yuklab bo‘lmadi",
    loadFailedDesc: "Internet aloqasini tekshiring va qayta urinib ko‘ring.",
    retryBtn: "Qayta urinish",
    notFoundTitle: "Mahsulot topilmadi",
    notFoundDesc: "Boshqa so‘rov yoki toifani tanlab ko‘ring.",

    // Delivery Section
    deliveryTitle1: "Tanlang. Savatga qo‘shing.",
    deliveryTitle2: "Mashqqa tayyor bo‘ling.",
    deliveryDesc1: "Protein, kreatin va vitaminlarni bir joyda taqqoslang.",
    deliveryHeading: "Yetkazib berish",
    deliveryDesc2: "Buyurtmada manzilingizni qoldiring. Yetkazish muddati va qiymatini menejer siz bilan aniqlashtiradi.",
    backToCatalog: "Katalogga qaytish",

    // Footer
    footerSlogan: "Maqsadingizga mos sport ozuqalari.",
    footerCatalog: "Katalog",
    footerCustomers: "Xaridorlarga",
    footerCopyright: "© 2026 FitCoreShop. Barcha huquqlar himoyalangan.",

    // Product Card
    addToCart: "Savatga",
    inCart: "Savatda",
    outOfStock: "Mavjud emas",
    currency: "so‘m",

    // Product Detail Page
    loadingProduct: "Mahsulot ma’lumotlari yuklanmoqda...",
    productNotFound: "Mahsulot topilmadi",
    backToHome: "Bosh sahifaga qaytish",
    back: "Orqaga qaytish",
    shop: "Do‘kon",
    qualityGuarantee: "Sifat kafolati",
    fastDelivery: "Tezkor yetkazish",
    standard: "Standart",
    availableToOrder: "Buyurtma qilish mumkin",
    originalGuarantee: "100% Original mahsulot",
    fastDeliveryUz: "O‘zbekiston bo‘ylab tez yetkazish",
    consultation: "Professional konsultatsiya",
    categoryLabel: "Kategoriya:",
    brandLabel: "Brend:",
    flavorLabel: "Ta’mi:",
    weightLabel: "Hajmi / Og‘irligi:",
    availabilityLabel: "Holati:",
    inStockStatus: "Omborda mavjud",
    outOfStockStatus: "Hozirda mavjud emas",
    orderNow: "Buyurtma berish",

    // Cart Drawer
    cartTitle: "Savatcha",
    cartItemsCount: "xil mahsulot",
    cartEmpty: "Savatchangiz hozircha bo‘sh",
    cartEmptyDesc: "Katalogimizdan kerakli mahsulotlarni tanlang",
    clearCart: "Savatni tozalash",
    totalSum: "Jami summa:",
    proceedToCheckout: "Buyurtma berish",

    // Checkout Modal
    checkoutTitle: "Buyurtmani rasmiylashtirish",
    checkoutSubtitle: "Yetkazib berish ma'lumotlarini to‘ldiring",
    nameLabel: "Ism va familiya",
    namePlaceholder: "Misol: Sardor Aliyev",
    phoneLabel: "Telefon raqam",
    addressLabel: "Yetkazib berish manzili",
    addressPlaceholder: "Shahar, tuman, ko‘cha va uy raqami",
    fillAllFields: "Iltimos, barcha maydonlarni to‘ldiring",
    submitOrder: "Buyurtmani tasdiqlash",
    submittingOrder: "Yuborilmoqda...",
    orderSuccessTitle: "Buyurtma Qabul Qilindi!",
    orderSuccessDesc: "Menejerlarimiz tez orada siz bilan bog‘lanishadi.",
    backToStore: "Do‘konga qaytish",
    orderError: "Buyurtmani yuborib bo‘lmadi.",
  },
  ru: {
    // Header & Navigation
    searchPlaceholder: "Поиск товаров или брендов",
    catalog: "Каталог",
    byGoal: "По целям",
    brands: "Бренды",
    sales: "Акции",
    delivery: "Доставка",
    navSlogan: "Сильная цель. Правильный выбор.",
    admin: "Админ",
    cart: "Корзина",
    all: "Все",
    clearSearch: "Очистить поиск",
    catalogMenuAria: "Меню каталога",

    // Hero
    heroTitleLine1: "Достойная энергия",
    heroTitleLine2: "для каждой тренировки.",
    heroSubtitle: "Спортивное питание под ваши цели.",
    viewCatalog: "Смотреть каталог",

    // Features
    featCatalog: "Каталог спортивного питания",
    featDelivery: "Доставка по всему Узбекистану",
    featChoice: "Подбор под вашу цель",

    // Goals Section
    chooseByGoal: "Выберите по вашей цели",
    allProducts: "Все товары",
    goalMuscle: "Рост мышц",
    goalMass: "Набор веса",
    goalRecovery: "Тренировки и восстановление",
    goalHealth: "Здоровье на каждый день",

    // Catalog & Filters
    sportsNutrition: "Спортивное питание",
    loadingCatalog: "Каталог загружается…",
    productsCount: "товаров",
    filterBtn: "Фильтр",
    filtersTitle: "Подбор товаров",
    mobileFiltersTitle: "Фильтры",
    sortDefault: "По умолчанию",
    sortAsc: "Цена: по возрастанию",
    sortDesc: "Цена: по убыванию",
    filterGoal: "Цель",
    filterAllGoals: "Все цели",
    filterCategory: "Категория",
    filterBrand: "Бренд",
    filterAllBrands: "Все бренды",
    filterPriceRange: "Диапазон цен, сум",
    priceFrom: "От",
    priceTo: "До",
    filterAvailable: "Товары в наличии",
    clearFilters: "Очистить",
    resetFilters: "Сбросить фильтры",
    applyFilters: "Показать результаты",
    loadMore: "Показать больше",
    showLess: "Показать меньше",

    // Empty & Error states
    loadFailedTitle: "Не удалось загрузить каталог",
    loadFailedDesc: "Проверьте интернет-соединение и попробуйте снова.",
    retryBtn: "Повторить",
    notFoundTitle: "Товары не найдены",
    notFoundDesc: "Попробуйте изменить запрос или категорию.",

    // Delivery Section
    deliveryTitle1: "Выбирайте. Добавляйте в корзину.",
    deliveryTitle2: "Готовьтесь к тренировке.",
    deliveryDesc1: "Сравнивайте протеин, креатин и витамины в одном месте.",
    deliveryHeading: "Доставка",
    deliveryDesc2: "Укажите адрес при заказе. Сроки и стоимость доставки менеджер согласует с вами.",
    backToCatalog: "Вернуться в каталог",

    // Footer
    footerSlogan: "Спортивное питание под ваши цели.",
    footerCatalog: "Каталог",
    footerCustomers: "Покупателям",
    footerCopyright: "© 2026 FitCoreShop. Все права защищены.",

    // Product Card
    addToCart: "В корзину",
    inCart: "В корзине",
    outOfStock: "Нет в наличии",
    currency: "сум",

    // Product Detail Page
    loadingProduct: "Загрузка информации о товаре...",
    productNotFound: "Товар не найден",
    backToHome: "Вернуться на главную",
    back: "Назад",
    shop: "Магазин",
    qualityGuarantee: "Гарантия качества",
    fastDelivery: "Быстрая доставка",
    standard: "Стандарт",
    availableToOrder: "Доступно к заказу",
    originalGuarantee: "100% Оригинальная продукция",
    fastDeliveryUz: "Быстрая доставка по всему Узбекистану",
    consultation: "Профессиональная консультация",
    categoryLabel: "Категория:",
    brandLabel: "Бренд:",
    flavorLabel: "Вкус:",
    weightLabel: "Объем / Вес:",
    availabilityLabel: "Наличие:",
    inStockStatus: "В наличии",
    outOfStockStatus: "Нет в наличии",
    orderNow: "Оформить заказ",

    // Cart Drawer
    cartTitle: "Корзина",
    cartItemsCount: "вид(ов) товара",
    cartEmpty: "Ваша корзина пока пуста",
    cartEmptyDesc: "Выберите нужные товары из нашего каталога",
    clearCart: "Очистить корзину",
    totalSum: "Итого:",
    proceedToCheckout: "Оформить заказ",

    // Checkout Modal
    checkoutTitle: "Оформление заказа",
    checkoutSubtitle: "Заполните данные для доставки",
    nameLabel: "Имя и фамилия",
    namePlaceholder: "Пример: Сардор Алиев",
    phoneLabel: "Номер телефона",
    addressLabel: "Адрес доставки",
    addressPlaceholder: "Город, район, улица и номер дома",
    fillAllFields: "Пожалуйста, заполните все поля",
    submitOrder: "Подтвердить заказ",
    submittingOrder: "Отправка...",
    orderSuccessTitle: "Заказ принят!",
    orderSuccessDesc: "Наши менеджеры свяжутся с вами в ближайшее время.",
    backToStore: "Вернуться в магазин",
    orderError: "Не удалось отправить заказ.",
  },
};

export type TranslationKey = keyof typeof translations.uz;

export const CATEGORY_TRANSLATIONS: Record<string, { uz: string; ru: string }> = {
  Barchasi: { uz: "Barchasi", ru: "Все" },
  Proteinlar: { uz: "Proteinlar", ru: "Протеины" },
  Geynerlar: { uz: "Geynerlar", ru: "Гейнеры" },
  Kreatin: { uz: "Kreatin", ru: "Креатин" },
  "BCAA & Aminolar": { uz: "BCAA & Aminolar", ru: "BCAA и Аминокислоты" },
  "Energiya & Pump": { uz: "Energiya & Pump", ru: "Энергия и Памп" },
  Vitaminlar: { uz: "Vitaminlar", ru: "Витамины" },
  "Yog' erituvchilar": { uz: "Yog‘ erituvchilar", ru: "Жиросжигатели" },
  "Yog‘ erituvchilar": { uz: "Yog‘ erituvchilar", ru: "Жиросжигатели" },
  "Tiklanish & Kuch": { uz: "Tiklanish & Kuch", ru: "Восстановление и Сила" },
};

export const GOAL_TRANSLATIONS: Record<string, { uz: string; ru: string }> = {
  "Mushak o‘stirish": { uz: "Mushak o‘stirish", ru: "Рост мышц" },
  "Vazn yig‘ish": { uz: "Vazn yig‘ish", ru: "Набор веса" },
  "Mashq va tiklanish": { uz: "Mashq va tiklanish", ru: "Тренировки и восстановление" },
  "Kundalik salomatlik": { uz: "Kundalik salomatlik", ru: "Здоровье на каждый день" },
};

export function translateCategory(cat: string, lang: Language): string {
  if (CATEGORY_TRANSLATIONS[cat]) {
    return CATEGORY_TRANSLATIONS[cat][lang];
  }
  return cat;
}

export function translateGoal(goal: string, lang: Language): string {
  if (GOAL_TRANSLATIONS[goal]) {
    return GOAL_TRANSLATIONS[goal][lang];
  }
  return goal;
}
