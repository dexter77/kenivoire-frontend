import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import AdCard from "../components/AdCard";

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Fonction pour lire les paramètres de recherche dans l'URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get("q") || "",
      ville: params.get("ville") || "",
      prix_max: params.get("prix_max") || "",
      categorie: params.get("categorie") || "",
    };
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError("");
      const { q, ville, prix_max, categorie } = getQueryParams();

      try {
        const res = await api.get("/annonces/", {
          params: { q, ville, prix_max, categorie },
        });
        setAds(res.data.results || res.data || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des annonces.");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [location.search]);

  if (loading) return <p className="text-center mt-10">Chargement des annonces...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center text-orange-700 mb-6">
        Résultats de la recherche
      </h1>

      {ads.length === 0 ? (
        <p className="text-center text-gray-600">
          Aucune annonce ne correspond à votre recherche.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
