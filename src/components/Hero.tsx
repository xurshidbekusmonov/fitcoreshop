// components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative bg-black text-white overflow-hidden py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Chap tomon: Matnlar */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase border border-amber-500/20">
            ✨ Haqiqiy Standart
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase">
            Gold Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Natijaga erishing
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl">
            Eng yuqori tozalikdagi proteinlar, kreatinlar va original vitaminlar. Chempionlar tanlovi endi O'zbekistonda.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all shadow-lg shadow-amber-500/20">
              Katalogni ko'rish
            </button>
            <button className="px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold border border-zinc-800 transition-all">
              Proteinlar
            </button>
          </div>
        </div>

        {/* O'ng tomon: Mahsulot Vizuali */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="absolute w-72 h-72 bg-amber-500/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-zinc-900 to-black p-6 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="h-80 flex items-center justify-center text-zinc-600 font-medium">
              [Mahsulot Rasmi Bu Yerda Bo'ladi]
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}