import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function EditAd() {
  const { authTokens } = useContext(AuthContext);
  const { adId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categorie_id: '',
    location: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère l'annonce et les catégories en parallèle
        const [adRes, catRes] = await Promise.all([
          api.get(`annonces/${adId}/`, {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
          api.get('categories/', {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
        ]);

        const ad = adRes.data;
        setFormData({
          title: ad.title,
          description: ad.description,
          price: ad.price,
          category_id: ad.category?.id || '',
          image: null,
        });

        setCategories(catRes.data.results || catRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err);
        setError('Impossible de charger l’annonce ou les catégories');
        setLoading(false);
      }
    };

    fetchData();
  }, [adId, authTokens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category_id', formData.category_id);
    if (formData.image) data.append('image', formData.image);
    if (formData.image2) data.append('image2', formData.image2);
    if (formData.image3) data.append('image3', formData.image3);

    try {
      await api.patch(`annonces/${adId}/`, data, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Annonce mise à jour avec succès 🎉');
      setTimeout(() => navigate('/account'), 1500);
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Erreur lors de la mise à jour de l’annonce');
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Modifier l’annonce
        </h2>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="text-green-600 bg-green-50 p-3 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full focus:ring-2 focus:ring-orange-400"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Prix (€)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Catégorie</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.length > 0 ? (
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
            <label className="block text-sm font-semibold mb-1 text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="btn bg-orange-600 hover:bg-orange-700 w-full text-white font-semibold mt-3"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
