import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authTokens) {
      // Si pas connecté, on redirige vers login
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil.');
      }
    };

    fetchProfile();
  }, [authTokens, navigate]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profile) return <div>Chargement du profil...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mon profil</h2>
      <p><strong>Nom d’utilisateur :</strong> {profile.username || user?.username}</p>
      <p><strong>Email :</strong> {profile.email || 'Non renseigné'}</p>
    </div>
  );
}
