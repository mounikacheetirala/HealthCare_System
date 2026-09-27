import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../services/api';

const PAGE_SIZE = 6;

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeSpec, setActiveSpec] = useState(searchParams.get('specialization') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([api.getDoctors(), api.getSpecializations()]).then(([d, s]) => {
      setDoctors(d);
      setSpecializations(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => { setPage(1); }, [query, activeSpec, sortBy]);

  const filtered = useMemo(() => {
    let list = doctors.filter((d) => d.status !== 'pending');
    if (activeSpec !== 'All') list = list.filter((d) => d.specialization === activeSpec);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
    }
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'experience') list = [...list].sort((a, b) => b.experience - a.experience);
    if (sortBy === 'fee-low') list = [...list].sort((a, b) => a.fee - b.fee);
    if (sortBy === 'fee-high') list = [...list].sort((a, b) => b.fee - a.fee);
    return list;
  }, [doctors, activeSpec, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectSpec(name) {
    setActiveSpec(name);
    const params = Object.fromEntries(searchParams);
    if (name === 'All') delete params.specialization; else params.specialization = name;
    setSearchParams(params);
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1>Find your doctor</h1>
            <p>Filter by specialty, sort by what matters most to you, and book directly.</p>
          </div>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={setQuery}
          placeholder="Search by name or specialty"
          className="mb-16"
          style={{ maxWidth: 'none' }}
        />

        <div className="chip-row mb-16">
          <button className={`chip ${activeSpec === 'All' ? 'active' : ''}`} onClick={() => selectSpec('All')}>All</button>
          {specializations.map((s) => (
            <button key={s.id} className={`chip ${activeSpec === s.name ? 'active' : ''}`} onClick={() => selectSpec(s.name)}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-16" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="text-sm text-muted">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</span>
          <select className="input" style={{ maxWidth: 220 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Sort by: Top rated</option>
            <option value="experience">Sort by: Most experienced</option>
            <option value="fee-low">Sort by: Fee (low to high)</option>
            <option value="fee-high">Sort by: Fee (high to low)</option>
          </select>
        </div>

        {loading ? <LoadingSpinner /> : (
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h4>No doctors match your search</h4>
              <p>Try a different specialty or search term.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-3 stagger">
                {pageItems.map((d) => <DoctorCard key={d.id} doctor={d} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-24">
                  <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <span className="text-sm text-muted">Page {page} of {totalPages}</span>
                  <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
}
