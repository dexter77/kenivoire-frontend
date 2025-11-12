import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CreateAd() {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Champs spécifiques véhicules/motos
  const [anneeMiseEnCirculation, setAnneeMiseEnCirculation] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [anneeModele, setAnneeModele] = useState('');
  const [marque, setMarque] = useState('');
  const [carburant, setCarburant] = useState('');
  const [transmission, setTransmission] = useState('');

  // Champs spécifiques immobilier
  const [typeOffre, setTypeOffre] = useState(''); // Vente / Location
  const [superficie, setSuperficie] = useState('');
  const [zone, setZone] = useState('');
  const [nbPieces, setNbPieces] = useState('');

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('categories/');
        if (Array.isArray(res.data)) setCategories(res.data);
        else if (res.data.results) setCategories(res.data.results);
      } catch (err) {
        console.error('Erreur de chargement des catégories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('categorie_id', category);
    if (image) formData.append('image', image);
    if (image2) formData.append('image2', image2);
    if (image3) formData.append('image3', image3);

    const selectedCat = categories.find(c => c.id === Number.parseInt(category, 10));
    const catName = selectedCat?.name || '';

    // Champs véhicules
    if (['Véhicule', 'Moto'].includes(catName)) {
      formData.append('annee_mise_en_circulation', anneeMiseEnCirculation);
      formData.append('kilometrage', kilometrage);
      formData.append('annee_modele', anneeModele);
      formData.append('marque', marque);
      formData.append('carburant', carburant);
      formData.append('transmission', transmission);
    }

    // Champs immobilier
    if (catName === 'Immobilier') {
      formData.append('type_offre', typeOffre);
      formData.append('superficie', superficie);
      formData.append('zone', zone);
      formData.append('nombre_pieces', nbPieces);
    }

    try {
      await api.post('annonces/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Annonce publiée avec succès 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de l’annonce");
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement des catégories...</p>;

  const selectedCat = categories.find(c => c.id === Number.parseInt(category, 10));
  const catName = selectedCat?.name || '';
  const isVehicle = ['Véhicule', 'Moto'].includes(catName);
  const isRealEstate = catName === 'Immobilier';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Créer une annonce
        </h2>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 bg-green-50 p-3 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champs généraux */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Titre</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea textarea-bordered w-full" rows="4" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Prix (FCFA)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input input-bordered w-full" required>
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image principale</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="file-input file-input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image 2 (optionnelle)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage2(e.target.files[0])} className="file-input file-input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image 3 (optionnelle)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage3(e.target.files[0])} className="file-input file-input-bordered w-full" />
          </div>

          {/* Champs spécifiques Véhicule/Moto */}
          {isVehicle && (
            <>
              <div>
                <label className="block text-sm font-medium">Année de mise en circulation</label>
                <input type="number" value={anneeMiseEnCirculation} onChange={(e) => setAnneeMiseEnCirculation(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Kilométrage</label>
                <input type="number" value={kilometrage} onChange={(e) => setKilometrage(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Année du modèle</label>
                <input type="number" value={anneeModele} onChange={(e) => setAnneeModele(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Marque</label>
                <input type="text" value={marque} onChange={(e) => setMarque(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Carburant</label>
                <select value={carburant} onChange={(e) => setCarburant(e.target.value)} className="input input-bordered w-full">
                  <option value="">-- Sélectionner --</option>
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="electrique">Électrique</option>
                  <option value="hybride">Hybride</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Transmission</label>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="input input-bordered w-full">
                  <option value="">-- Sélectionner --</option>
                  <option value="manuelle">Manuelle</option>
                  <option value="automatique">Automatique</option>
                </select>
              </div>
            </>
          )}

          {/* Champs spécifiques Immobilier */}
          {isRealEstate && (
            <>
              <div>
                <label className="block text-sm font-medium">Type d’offre</label>
                <select value={typeOffre} onChange={(e) => setTypeOffre(e.target.value)} className="input input-bordered w-full" required>
                  <option value="">-- Sélectionner --</option>
                  <option value="vente">Vente</option>
                  <option value="location">Location</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Superficie (m²)</label>
                <input type="number" value={superficie} onChange={(e) => setSuperficie(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Zone / Quartier</label>
                <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Nombre de pièces</label>
                <input type="number" value={nbPieces} onChange={(e) => setNbPieces(e.target.value)} className="input input-bordered w-full" />
              </div>
            </>
          )}

          <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 w-full text-white font-semibold mt-3">
            Publier l’annonce
          </button>
        </form>
      </div>
    </div>
  );
}
