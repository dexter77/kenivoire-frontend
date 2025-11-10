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

  // Charger les catégories depuis le backend
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/');
      console.log('Réponse backend catégories:', res.data);

      // Adapte selon la structure réelle :
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data.results) {
        setCategories(res.data.results);
      } else if (res.data.categories) {
        setCategories(res.data.categories);
      } else {
        setCategories([]); // sécurité
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Créer une annonce
        </h2>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 bg-green-50 p-3 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              placeholder="Ex : Vente de smartphone neuf"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full focus:ring-2 focus:ring-orange-400"
              placeholder="Décrivez votre annonce..."
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Prix (FCFA)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              placeholder="Ex : 120"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Sélectionnez une catégorie</option>
              {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>Aucune catégorie disponible</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image (principale)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input file-input-bordered w-full focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image 2 (optionnelle)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage2(e.target.files[0])}
              className="file-input file-input-bordered w-full focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image 3 (optionnelle)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage3(e.target.files[0])}
              className="file-input file-input-bordered w-full focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="btn bg-orange-600 hover:bg-orange-700 w-full text-white font-semibold mt-3"
          >
            Publier l’annonce
          </button>
        </form>
      </div>
    </div>
  );
}
