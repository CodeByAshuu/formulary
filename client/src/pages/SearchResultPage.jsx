import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMedicines } from '../api/medicine';

function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMedicines(query);
        setMedicines(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #084734;
    --accent: #CEF17B;
    --bg-soft: #CDEDB3;
    --bg-page: #f0f9ea;
    --text-main: #0c2e22;
    --text-muted: #3a6652;
    --border: rgba(8,71,52,0.12);
  }
    .hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(2.8rem, 6vw, 4.2rem);
      color: #ffffff; line-height: 1.05;
      position: relative; z-index: 1; margin-bottom: 20px;
    }
    .hero-title em { font-style: italic; color: var(--accent); }
  `;

  return (
    <><style>{styles}</style>
    <div className="min-h-screen bg-[#CDEDB3]">

      {/* ── Hero Header ── */}
      <div className="relative bg-[#084734] px-8 pt-8 pb-20 overflow-hidden">
        {/* blob */}
        <div className="absolute -top-28 -right-16 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(206,241,123,0.13)_0%,transparent_70%)] pointer-events-none" />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-b from-transparent to-[#CDEDB3] pointer-events-none" />

        {/* title row */}
        <div className="relative z-10 flex items-center gap-3 mb-5">
          <h1 className="hero-title">Formu<em class="text-[#CEF17B]">lary</em> Search</h1>
          <span className="text-[10px] font-semibold uppercase tracking-widest bg-[rgba(206,241,123,0.15)] border border-[rgba(206,241,123,0.35)] text-[#CEF17B] px-3 py-1 rounded-full">
            Clinical View
          </span>
        </div>

        {/* search box */}
        <div className="relative z-10 flex items-center max-w-xl bg-white/[0.07] border border-[rgba(206,241,123,0.35)] rounded-2xl px-5 py-4 gap-3 focus-within:border-[#CEF17B] focus-within:shadow-[0_0_0_4px_rgba(206,241,123,0.12)] transition-all">
          <span className="material-symbols-outlined text-[rgba(206,241,123,0.65)] text-xl">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search medicine (e.g., Paracetamol)..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[rgba(205,237,179,0.45)] text-sm caret-[#CEF17B]"
          />
          <span className="text-[10px] text-[rgba(205,237,179,0.5)] border border-[rgba(205,237,179,0.2)] rounded px-2 py-0.5 whitespace-nowrap">
            Press <strong className="text-[#CEF17B]">Enter</strong>
          </span>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-8xl mx-auto px-8 py-6 pb-16">

        {/* meta */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-[#084734]">Results for "{query}"</h2>
          <p className="text-sm text-[#3a6652] mt-1">
            {loading ? 'Searching...' : `Found ${medicines.length} clinical profiles.`}
          </p>
        </div>

        {/* spinner */}
        {loading && (
          <div className="w-9 h-9 border-[3px] border-[rgba(8,71,52,0.15)] border-t-[#084734] rounded-full animate-spin mx-auto mt-20" />
        )}

        {/* grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="group relative bg-white border border-[rgba(8,71,52,0.1)] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#084734] to-[#CEF17B] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* name + composition */}
                <div>
                  <div className="font-serif text-lg text-[#084734] mb-1">{med.name}</div>
                  <div className="text-xs text-[#3a6652] leading-relaxed">{med.composition}</div>
                </div>

                <div className="h-px bg-[rgba(8,71,52,0.08)]" />

                {/* manufacturer + price */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a6652] mb-1">Manufacturer</div>
                    <div className="text-sm font-medium text-[#0c2e22]">{med.manufacturer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a6652] mb-1">Retail Price</div>
                    <div className="font-serif text-2xl text-[#084734]">${med.price}</div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={`/medicine/${med.id}`}
                  className="block text-center bg-[#084734] text-[#CEF17B] text-[11px] font-semibold uppercase tracking-widest py-3 rounded-xl hover:bg-[#0a5c44] hover:scale-[1.01] transition-all"
                >
                  View Clinical Profile
                </Link>
              </div>
            ))}

            {/* empty state */}
            {medicines.length === 0 && (
              <div className="col-span-full bg-white border border-[rgba(8,71,52,0.1)] rounded-2xl p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#CDEDB3] flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-[#084734] text-3xl">search_off</span>
                </div>
                <div className="font-serif text-lg text-[#084734] mb-2">No results found</div>
                <p className="text-sm text-[#3a6652]">Try searching for a different name or composition.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default SearchResultPage;