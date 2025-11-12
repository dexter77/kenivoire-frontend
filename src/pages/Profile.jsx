import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Camera, CheckCircle2, XCircle, Lock } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
  const navigate = useNavigate();

  const labels = {
    first_name: 'Prénom',
    last_name: 'Nom',
    username: "Nom d’utilisateur",
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    city: 'Ville',
    birth_date: 'Date de naissance',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('me/');
        setUser(response.data);
        setFormData(response.data);
        setPreview(response.data.profile_image || null);
      } catch (err) {
        setError('Erreur de chargement du profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    for (const key of Object.keys(formData)) {
      if (formData[key] !== null) formDataToSend.append(key, formData[key]);
    }
    if (profileImage) formDataToSend.append('profile_image', profileImage);

    try {
      const response = await api.patch('/me/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post('change-password/', passwordData);
      setSuccess('Mot de passe changé avec succès !');
      setShowPasswordModal(false);
    } catch {
      setError('Erreur lors du changement de mot de passe');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full border border-gray-100 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={preview || 'https://via.placeholder.com/120x120.png?text=Profil'}
              alt="Profil"
              className="w-28 h-28 rounded-full object-cover border-4 border-orange-200"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full text-white cursor-pointer hover:bg-orange-700"
            >
              <Camera size={18} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-bold text-orange-700 mt-4">Mon profil</h2>
          <p className="text-gray-500 text-sm">Gérez vos informations personnelles</p>
        </div>

        {success && (
          <div className="flex items-center bg-green-100 text-green-700 p-2 rounded-md mb-4 text-sm">
            <CheckCircle2 className="mr-2" size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center bg-red-100 text-red-700 p-2 rounded-md mb-4 text-sm">
            <XCircle className="mr-2" size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(labels).map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                {labels[field]} {['first_name','last_name','username','email','city','birth_date'].includes(field) && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field === 'birth_date' ? 'date' : 'text'}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                className="border w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required={['first_name','last_name','username','email','city','birth_date'].includes(field)}
              />
            </div>
          ))}

          <div className="sm:col-span-2 flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Enregistrer les changements
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
            >
              <Lock size={18} /> Modifier le mot de passe
            </button>

            <button
              onClick={() => navigate(`/my-ads/${user.id}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Voir mes annonces
            </button>
          </div>
        </form>
      </div>

      {/* === MODALE CHANGEMENT MOT DE PASSE === */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">Modifier le mot de passe</h3>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input
                type="password"
                name="old_password"
                placeholder="Ancien mot de passe"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                className="border w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />
              <input
                type="password"
                name="new_password"
                placeholder="Nouveau mot de passe"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                className="border w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
