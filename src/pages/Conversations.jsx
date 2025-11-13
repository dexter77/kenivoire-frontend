import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function Conversations() {
  const { authTokens } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Charger les conversations ---
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('messaging/conversations/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setConversations(res.data.results || []);
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [authTokens]);

  // --- Marquer comme lus et naviguer ---
  const handleOpenConversation = async (conversationId) => {
    try {
      // 🔹 Marque les messages comme lus
      await api.post(`messaging/mark-read/${conversationId}/`, {}, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      // 🔹 Récupère le nouveau nombre de messages non lus
      const unreadRes = await api.get('messaging/unread/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      // 🔹 Informe la Navbar via un event global
      window.dispatchEvent(new CustomEvent('updateUnread', {
        detail: unreadRes.data.unread_count || 0
      }));
    } catch (err) {
      console.warn('⚠️ Erreur lors du marquage comme lu :', err);
    } finally {
      // 🔹 Redirige toujours vers la page de conversation
      navigate(`/messages/${conversationId}`);
    }
  };

  // --- Supprimer une conversation ---
  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm("Voulez-vous vraiment supprimer cette conversation ?")) return;

    try {
      await api.delete(`messaging/conversations/${convId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      // 🔹 Retire la conversation de l’état local
      setConversations(prev => prev.filter(c => c.id !== convId));

      // 🔹 Met à jour le compteur global
      const res = await api.get('messaging/unread/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      window.dispatchEvent(new CustomEvent('updateUnread', {
        detail: res.data.unread_count || 0
      }));
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de la conversation :', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement des conversations...</p>;
  if (!conversations.length) return <p className="text-center mt-10">Aucune conversation.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">Mes conversations</h2>

      <div className="flex flex-col gap-3">
        {conversations.map((conv) => {
          // Dernier message
          const lastMsg = conv.messages?.length > 0
            ? conv.messages[conv.messages.length - 1]
            : null;

          // Indique s'il y a des messages non lus (autres que ceux de l'utilisateur)
          const hasUnread = lastMsg && !lastMsg.read && lastMsg.sender.username !== conv.current_user;

          return (
            <div
              key={conv.id}
              onClick={() => handleOpenConversation(conv.id)}
              className={`p-4 bg-white rounded-lg shadow flex justify-between items-center hover:bg-orange-50 transition cursor-pointer ${
                hasUnread ? 'border-l-4 border-orange-600' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Annonce : {conv.ad?.title || `#${conv.ad}`}
                </p>

                <p className="text-gray-800 font-medium">
                  {conv.participants.map(p => p.username).join(', ')}
                </p>

                {lastMsg ? (
                  <p className={`text-sm truncate ${hasUnread ? 'text-orange-700 font-semibold' : 'text-gray-600'}`}>
                    {hasUnread ? '📩 ' : ''} {lastMsg.content}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm italic">Aucun message</p>
                )}
              </div>

              {/* Bouton Supprimer */}
              <button
                onClick={(e) => handleDeleteConversation(e, conv.id)}
                className="ml-4 text-red-600 hover:text-red-800 font-bold"
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
