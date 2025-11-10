import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../api/axiosConfig';

export default function AdDetail() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null); // ✅ image principale

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`annonces/${id}/`);
        setAd(res.data);

        // ✅ on définit la première image par défaut
        const imgs = [res.data.image, res.data.image2, res.data.image3].filter(Boolean);
        setMainImage(imgs[0] || '/placeholder.png');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement de l'annonce...</p>;
  if (!ad) return <p className="text-center mt-10 text-red-600">Annonce introuvable</p>;

  const images = [ad.image, ad.image2, ad.image3].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      {/* Galerie d'images */}
      {images.length > 0 && (
        <div className="mb-6">
          {/* ✅ Image principale dynamique */}
          <div className="relative w-full pb-[56.25%] mb-4">
            <img
              src={mainImage}
              alt={ad.title}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-all duration-300"
            />
          </div>

          {/* ✅ Miniatures cliquables */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${ad.title} - ${index + 1}`}
                  onClick={() => setMainImage(img)} // ✅ clique pour changer l’image principale
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                    mainImage === img ? 'border-orange-500' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Titre et prix */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{ad.title}</h1>
        <span className="text-orange-600 font-semibold text-xl">{ad.price} FCFA</span>
      </div>

      {/* Catégorie */}
      {ad.categorie?.name && (
        <p className="text-sm text-gray-500 mb-2">
          Catégorie : <span className="font-medium">{ad.categorie.name}</span>
        </p>
      )}

      {/* Description */}
      <p className="text-gray-700 mb-4">{ad.description}</p>

      {/* Informations utilisateur et lieu */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{ad.owner?.username || 'Utilisateur inconnu'}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{ad.owner?.city || 'Lieu non spécifié'}</span>
        </div>
        {ad.created_at && (
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
            </svg>
            <span>Publié le {dayjs(ad.created_at).format('DD/MM/YYYY')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
