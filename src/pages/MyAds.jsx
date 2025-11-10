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
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setAds(response.data.results || response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMyAds();
  }, [authTokens]);

  if (loading) return <p>Chargement de vos annonces...</p>;

  return (
    <div className="my-ads-container">
      <h2>Mes annonces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="relative">
            <AdCard ad={ad} />
            <Link
              to={`/ads/edit/${ad.id}`}
              className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
            >
              Modifier
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
