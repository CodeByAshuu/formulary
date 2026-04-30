import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMedicineDetails, getMedicineSubstitutes } from '../api/medicine';

function MedicineDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [substitutesCount, setSubstitutesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medData, subData] = await Promise.all([
          getMedicineDetails(id),
          getMedicineSubstitutes(id)
        ]);
        setMedicine(medData);
        setSubstitutesCount(subData.length);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#CDEDB3' }}>
        <div
          className="animate-spin rounded-full"
          style={{ width: 48, height: 48, border: '5px solid #084734', borderTopColor: 'transparent' }}
        ></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#CDEDB3' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#084734' }}>Clinical profile not found</h2>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all"
          style={{ backgroundColor: '#084734', color: '#CEF17B' }}
        >
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body p-6 sm:p-10 relative overflow-hidden" style={{ backgroundColor: '#CDEDB3', color: '#084734' }}>

      {/* Background blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-xl h-xl rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(8,71,52,0.07)', filter: 'blur(100px)' }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-xl h-xl rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(206,241,123,0.3)', filter: 'blur(100px)' }}
      ></div>

      <div className="max-w-8xl mx-auto relative z-10 space-y-8">

        {/* ── Hero Header ── */}
        <div
          className="p-8 rounded-[2.5rem] border relative overflow-hidden"
          style={{ backgroundColor: '#084734', borderColor: 'rgba(206,241,123,0.2)' }}
        >
          {/* Decorative bg icon */}
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: 120, color: '#CEF17B' }}>medication</span>
          </div>

          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-6 transition-opacity hover:opacity-70"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(206,241,123,0.7)' }}
          >
            &larr; Back to Results
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
            {/* Left — name + composition */}
            <div className="space-y-2">
              <div
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 border"
                style={{ backgroundColor: 'rgba(206,241,123,0.15)', borderColor: 'rgba(206,241,123,0.3)', color: '#CEF17B' }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#CEF17B' }}></span>
                Active Molecular Profile
              </div>
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#CEF17B' }}>{medicine.name}</h1>
              <p className="text-sm font-medium" style={{ color: 'rgba(205,237,179,0.7)' }}>{medicine.composition}</p>
            </div>

            {/* Right — price */}
            <div
              className="px-6 py-4 rounded-2xl border text-right shrink-0"
              style={{ backgroundColor: 'rgba(206,241,123,0.1)', borderColor: 'rgba(206,241,123,0.25)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(205,237,179,0.6)' }}>
                Standard Unit Retail
              </p>
              <p className="text-3xl font-bold" style={{ color: '#CEF17B' }}>${medicine.price}</p>
            </div>
          </div>
        </div>

        {/* ── Section title ── */}
        <h2 className="text-lg font-semibold px-1" style={{ color: '#084734' }}>Clinical Profile</h2>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Pharmacological Overview — spans 2 cols */}
          <div
            className="md:col-span-2 p-8 rounded-[2.5rem] border space-y-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            <h3 className="text-lg font-semibold" style={{ color: '#084734' }}>Pharmacological Overview</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#2a6645' }}>
              {medicine.description ||
                `This molecular profile for ${medicine.name} (${medicine.composition}) provides verified manufacturer data and pricing strategy. For full contraindications, consult the clinical repository.`}
            </p>

            <div
              className="grid grid-cols-2 gap-4 pt-4 border-t"
              style={{ borderColor: 'rgba(8,71,52,0.1)' }}
            >
              {[
                { label: 'Manufacturer', value: medicine.manufacturer },
                { label: 'Composition Status', value: 'Exact Molecular Match' },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-widest font-medium" style={{ color: '#2a6645' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#084734' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Analysis */}
          <div
            className="p-8 rounded-[2.5rem] border flex flex-col justify-between space-y-6"
            style={{ backgroundColor: '#084734', borderColor: 'rgba(206,241,123,0.2)' }}
          >
            <div className="space-y-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(206,241,123,0.15)' }}
              >
                <span className="material-symbols-outlined text-xl" style={{ color: '#CEF17B' }}>compare_arrows</span>
              </div>
              <h3 className="text-base font-semibold" style={{ color: '#CEF17B' }}>Optimization Analysis</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(205,237,179,0.7)' }}>
                We have identified{' '}
                <span className="font-bold" style={{ color: '#CEF17B' }}>{substitutesCount}</span>{' '}
                pharmacological equivalents with varying cost structures.
              </p>
            </div>
            <Link
              to={`/substitutes/${medicine.id}`}
              className="block text-center px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              style={{ backgroundColor: '#CEF17B', color: '#084734' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d8f96a'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#CEF17B'; }}
            >
              Compare Price Strategy
            </Link>
          </div>

          {/* Molecular Repository — full width */}
          <div
            className="md:col-span-3 p-6 rounded-4xl border flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.45)', borderColor: 'rgba(8,71,52,0.1)' }}
          >
            <span className="material-symbols-outlined text-lg pb-2" style={{ color: '#084734' }}>biotech</span>
            <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'rgba(8,71,52,0.15)' }}></div>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#084734' }}>Molecular Repository</h3>
            <div
              className="w-px h-4 hidden sm:block"
              style={{ backgroundColor: 'rgba(8,71,52,0.2)' }}
            ></div>
            {[
              { label: 'Manufacturer of Record', value: medicine.manufacturer },
              { label: 'Indexed ID', value: `MED-${medicine.id.toString().padStart(5, '0')}` },
              { label: 'Price Verification Index', value: new Date().toLocaleDateString() },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && (
                  <div className="w-px h-4 hidden sm:block" style={{ backgroundColor: 'rgba(8,71,52,0.15)' }}></div>
                )}
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#2a6645' }}>{label}:</span>
                <span className="text-xs font-bold" style={{ color: '#084734' }}>{value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MedicineDetailPage;