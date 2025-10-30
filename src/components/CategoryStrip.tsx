export default function CategoryStrip() {
    const cats = ["Necklaces", "Earrings", "Bracelets", "Bangles", "Anklets", "Rings"];
  
    return (
      <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide">
        {cats.map((c) => (
          <button
            key={c}
            className="px-6 py-2 border rounded-full text-sm font-medium hover:bg-royal-600 hover:text-white transition-all whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>
    );
  }
  