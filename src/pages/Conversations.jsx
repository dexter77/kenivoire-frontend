import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function Conversations() {
  const { authTokens } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('messaging/conversations/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setConversations(res.data.results || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement des conversations...</p>;
  if (!conversations.length) return <p className="text-center mt-10">Aucune conversation.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">Mes conversations</h2>
      <div className="flex flex-col gap-3">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:bg-orange-50 transition"
          >
            {/* Clic sur la card pour naviguer */}
            <div
              onClick={() => navigate(`/messages/${conv.id}`)}
              className="flex-1 cursor-pointer"
            >
              <p className="text-sm text-gray-500">
                Annonce: {conv.ad?.title || `#${conv.ad}`}
              </p>
              <p className="text-gray-800 font-medium">
                Message de : {conv.participants.map(p => p.username).join(', ')}
              </p>
              {conv.messages.length > 0 ? (
                <p className="text-gray-600 text-sm truncate">
                  Dernier message: {conv.messages[conv.messages.length - 1].content}
                </p>
              ) : (
                <p className="text-gray-400 text-sm italic">Aucun message</p>
              )}
            </div>

            {/* Bouton Supprimer à droite */}
            <button
              onClick={async (e) => {
                e.stopPropagation(); // empêche la navigation
                if (window.confirm("Voulez-vous vraiment supprimer cette conversation ?")) {
                  try {
                    await api.delete(`messaging/conversations/${conv.id}/`, {
                      headers: { Authorization: `Bearer ${authTokens.access}` },
                    });
                    setConversations(prev => prev.filter(c => c.id !== conv.id));
                  } catch (err) {
                    console.error("Erreur suppression conversation :", err);
                  }
                }
              }}
              className="ml-4 text-red-600 hover:text-red-800 font-bold"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
