import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import AdCard from '../components/AdCard';

export default function MyAds() {
  const { authTokens } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const response = await api.get('annonces/?mine=true', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setAds(response.data.results || response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAds();
  }, [authTokens]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
    try {
      await api.delete(`annonces/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      // Supprime l'annonce du state
      setAds(ads.filter(ad => ad.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Impossible de supprimer l'annonce.");
    }
  };

  if (loading) return <p>Chargement de vos annonces...</p>;

  return (
    <div className="my-ads-container">
      <h2 className="text-2xl font-bold mb-4">Mes annonces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="relative border rounded-lg p-2">
            <AdCard ad={ad} />
            <div className="absolute top-2 right-2 flex gap-2">
              <Link
                to={`/ads/edit/${ad.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
              >
                Modifier
              </Link>
              <button
                onClick={() => handleDelete(ad.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
