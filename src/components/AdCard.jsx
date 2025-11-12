import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const AdCard = ({ ad }) => {
  const images = [ad.image, ad.image2, ad.image3].filter(Boolean);

  return (
    <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
      {/* Images */}
      {images.length > 0 ? (
        <div className="relative w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-56 relative snap-center"
            >
              <img
                src={img}
                alt={`${ad.title} - image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <img
          src="/placeholder.png"
          alt="Image par défaut"
          className="w-full h-56 object-cover"
        />
      )}

      {/* Contenu */}
      <div className="p-4">
        {/* Titre & prix */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {ad.title}
          </h2>
          <span className="text-orange-600 font-semibold whitespace-nowrap">
            {ad.price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        {/* Catégorie */}
        {ad.category?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Catégorie : <span className="font-medium">{ad.category.name}</span>
          </p>
        )}

        {/* Infos utilisateur & lieu */}
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{ad.owner?.username || 'Utilisateur inconnu'}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{ad.location || ad.owner?.city || 'Lieu non spécifié'}</span>
          </div>
        </div>

        {/* Date de publication */}
        {ad.created_at && (
          <p className="text-xs text-gray-400 mt-1">
            Publié le {dayjs(ad.created_at).format('DD/MM/YYYY')}
          </p>
        )}

        {/* Bouton voir l'annonce */}
        <Link
          to={`/ads/${ad.id}`}
          className="block mt-3 text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Voir l'annonce
        </Link>
      </div>
    </div>
  );
};

AdCard.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    image2: PropTypes.string,
    image3: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    created_at: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,
      city: PropTypes.string,
    }),
  }).isRequired,
};

export default AdCard;
