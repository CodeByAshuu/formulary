import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicineDetails, getMedicineSubstitutes } from '../api/medicine';

function SubstituteComparisonPage() {
  const { id } = useParams();
  const [referenceMedicine, setReferenceMedicine] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refData, subData] = await Promise.all([
          getMedicineDetails(id),
          getMedicineSubstitutes(id)
        ]);
        setReferenceMedicine(refData);
        const sortedSubs = [...subData].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        setSubstitutes(sortedSubs);
      } catch (err) {
        console.error('Failed to fetch comparison data:', err);
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
        />
      </div>
    );
  }

  if (!referenceMedicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#CDEDB3' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#084734' }}>Pharmacological reference not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest"
          style={{ backgroundColor: '#084734', color: '#CEF17B' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const cheapestPrice = substitutes.length > 0 ? parseFloat(substitutes[0].price) : null;

  return (
    <div className="min-h-screen font-body sm:p-10 relative overflow-hidden" style={{ backgroundColor: '#CDEDB3', color: '#084734' }}>

      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-xl h-144 rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(8,71,52,0.07)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-xl h-144 rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(206,241,123,0.3)', filter: 'blur(100px)' }} />

      <div className="max-w-8xl mx-auto relative z-10 space-y-8">

        {/* ── Hero Header ── */}
        <div
          className="p-8 rounded-[2.5rem] border relative overflow-hidden"
          style={{ backgroundColor: '#084734', borderColor: 'rgba(206,241,123,0.2)' }}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: 120, color: '#CEF17B' }}>compare_arrows</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(206,241,123,0.7)' }}
          >
            &larr; Back to Detail
          </button>

          <div className="relative z-10 space-y-2">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#CEF17B' }}>Substitute Analysis</h1>
            <p className="text-sm font-medium" style={{ color: 'rgba(205,237,179,0.7)' }}>
              Cost-effective alternatives for{' '}
              <span className="font-bold" style={{ color: '#CEF17B' }}>{referenceMedicine.name}</span>
            </p>
          </div>
        </div>

        {/* ── Main Grid: Reference + Substitutes ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">

          {/* ── Reference Drug Card ── */}
          <div
            className="p-6 rounded-4xl border-2 flex flex-col gap-5 relative h-full"
            style={{ backgroundColor: '#084734', borderColor: '#CEF17B' }}
          >
            {/* Badge */}
            <div
              className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
              style={{ backgroundColor: '#CEF17B', color: '#084734' }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#084734' }}></span>
              Reference Drug
            </div>

            <div className="flex items-start justify-between gap-2 mt-2">
              <h3 className="text-base font-bold leading-tight" style={{ color: '#CEF17B' }}>{referenceMedicine.name}</h3>
            </div>

            <div className="space-y-3 flex-1">
              {[
                { label: 'Active Ingredients', value: referenceMedicine.composition },
                { label: 'Manufacturer', value: referenceMedicine.manufacturer },
                { label: 'Pharmacological Status', value: 'Verified Molecule' },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-[0.65rem] uppercase tracking-widest font-medium" style={{ color: 'rgba(205,237,179,0.6)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(205,237,179,0.9)' }}>{value}</p>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl mt-auto"
              style={{
                backgroundColor: 'rgba(206,241,123,0.12)',
                border: '1px solid rgba(206,241,123,0.25)',
              }}
            >
              <div className="space-y-0.5">
                <p className="text-[0.65rem] uppercase tracking-widest font-medium" style={{ color: 'rgba(205,237,179,0.6)' }}>Standard Cost</p>
                <p className="text-xl font-bold" style={{ color: '#CEF17B' }}>${referenceMedicine.price}</p>
              </div>
            </div>
          </div>

          {/* ── Substitutes ── */}
            {substitutes.length === 0 ? (
              <div
                className="md:col-span-1 lg:col-span-2 xl:col-span-3 p-16 rounded-4xl border text-center space-y-3 flex flex-col justify-center items-center h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.5)' }}
              >
                <span className="material-symbols-outlined text-4xl" style={{ color: '#2a6645' }}>search_off</span>
                <h3 className="text-lg font-semibold" style={{ color: '#084734' }}>No substitutes found</h3>
                <p className="text-sm" style={{ color: '#2a6645' }}>No molecular matches are currently in the clinical repository for this compound.</p>
              </div>
            ) : (
              <>
                {substitutes.map((sub) => {
                  const isCheapest = parseFloat(sub.price) === cheapestPrice;
                  const savings = Math.round(
                    ((parseFloat(referenceMedicine.price) - parseFloat(sub.price)) / parseFloat(referenceMedicine.price)) * 100
                  );

                  return (
                    <div
                      key={sub.id}
                      className="p-6 rounded-4xl border-2 flex flex-col gap-5 relative h-full"
                      style={{
                        backgroundColor: isCheapest ? '#084734' : 'rgba(255,255,255,0.65)',
                        backdropFilter: isCheapest ? 'none' : 'blur(16px)',
                        borderColor: isCheapest ? '#CEF17B' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {/* Best Price badge */}
                      {isCheapest && (
                        <div
                          className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{ backgroundColor: '#CEF17B', color: '#084734' }}
                        >
                          Best Price Strategy
                        </div>
                      )}

                      {/* Name + match */}
                      <div className="flex items-start justify-between gap-2 mt-2">
                        <h3
                          className="text-base font-bold leading-tight"
                          style={{ color: isCheapest ? '#CEF17B' : '#084734' }}
                        >
                          {sub.name}
                        </h3>
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
                          style={
                            isCheapest
                              ? { backgroundColor: 'rgba(206,241,123,0.2)', color: '#CEF17B', border: '1px solid rgba(206,241,123,0.3)' }
                              : { backgroundColor: 'rgba(8,71,52,0.08)', color: '#084734' }
                          }
                        >
                          100% Match
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="space-y-3 flex-1">
                        {[
                          { label: 'Manufacturer', value: sub.manufacturer },
                          { label: 'Molecule Index', value: 'Pharmacological Equivalent' },
                        ].map(({ label, value }) => (
                          <div key={label} className="space-y-0.5">
                            <p
                              className="text-[0.65rem] uppercase tracking-widest font-medium"
                              style={{ color: isCheapest ? 'rgba(205,237,179,0.6)' : '#2a6645' }}
                            >
                              {label}
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: isCheapest ? 'rgba(205,237,179,0.9)' : '#084734' }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Price row */}
                      <div
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          backgroundColor: isCheapest ? 'rgba(206,241,123,0.12)' : 'rgba(205,237,179,0.4)',
                          border: isCheapest ? '1px solid rgba(206,241,123,0.25)' : '1px solid rgba(8,71,52,0.08)',
                        }}
                      >
                        <div className="space-y-0.5">
                          <p
                            className="text-[0.65rem] uppercase tracking-widest font-medium"
                            style={{ color: isCheapest ? 'rgba(205,237,179,0.6)' : '#2a6645' }}
                          >
                            Retail Cost
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{ color: isCheapest ? '#CEF17B' : '#084734' }}
                          >
                            ${sub.price}
                          </p>
                        </div>
                        <div
                          className="px-3 py-1.5 rounded-full text-xs font-bold"
                          style={
                            isCheapest
                              ? { backgroundColor: '#CEF17B', color: '#084734' }
                              : { backgroundColor: '#084734', color: '#CEF17B' }
                          }
                        >
                          Save {savings}%
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => navigate(`/medicine/${sub.id}`)}
                        className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        style={
                          isCheapest
                            ? { backgroundColor: '#CEF17B', color: '#084734' }
                            : { backgroundColor: '#084734', color: '#CEF17B' }
                        }
                        onMouseEnter={e => {
                          if (isCheapest) e.currentTarget.style.backgroundColor = '#d8f96a';
                          else e.currentTarget.style.backgroundColor = '#0d6648';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = isCheapest ? '#CEF17B' : '#084734';
                        }}
                      >
                        View Clinical Profile
                      </button>
                    </div>
                  );
                })}
              </>
            )}
      </div>
    </div>
    </div>
  );
}

export default SubstituteComparisonPage;