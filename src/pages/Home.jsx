import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import AdCard from '../components/AdCard';

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch des annonces
  const fetchAds = () => {
    setLoading(true);
    const params = { page };

    api.get('ads/', { params })
      .then((res) => {
        const results = res.data.results || res.data || [];
        setAds(results);
        if (res.data.count) {
          setTotalPages(Math.ceil(res.data.count / 10)); // 10 annonces par page
        } else {
          setTotalPages(1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center text-orange-700 mb-6">
        Annonces récentes
      </h1>

      {/* Liste d'annonces */}
      {ads.length === 0 ? (
        <p className="text-center text-gray-600">Aucune annonce disponible pour le moment.</p>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="btn btn-outline"
        >
          Précédent
        </button>
        <span className="text-gray-600"> Page {page} / {totalPages} </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-outline"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
