import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function ConversationDetail() {
  const { authTokens, user } = useContext(AuthContext);
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const authHeaders = authTokens?.access
    ? { Authorization: `Bearer ${authTokens.access}` }
    : {};

  // --- 🔸 Charger la conversation ---
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await api.get(`messaging/conversations/${conversationId}/`, {
          headers: authHeaders,
        });
        setConversation(res.data);
      } catch (err) {
        console.error('Erreur de chargement de la conversation:', err);
      }
    };

    if (conversationId) fetchConversation();
  }, [conversationId]); // ✅ pas de dépendance sur authHeaders

  // --- 🔸 Envoi d’un message ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      const res = await api.post(
        'messaging/messages/',
        { conversation: conversationId, content: newMessage },
        { headers: authHeaders }
      );

      // ✅ Mise à jour locale sans refetch
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));

      setNewMessage('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Erreur lors de l’envoi du message:', err);
      if (err.response?.data) console.error('Détails:', err.response.data);
    }
  };

  // --- 🔸 Scroll automatique ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  if (!conversation) return <p className="text-center mt-10">Chargement...</p>;

  const ad = conversation.ad || {};

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh]">
      {/* --- Colonne gauche : détails de l’annonce --- */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold text-orange-700 mb-2">
          {ad.title || 'Annonce'}
        </h2>
        {ad.image && (
          <img
            src={ad.image}
            alt={ad.title}
            className="rounded-lg mb-3 h-48 w-full object-cover"
          />
        )}
        {ad.price && (
          <p className="text-lg font-semibold text-gray-800 mb-1">
            {ad.price} FCFA
          </p>
        )}
        {ad.location && (
          <p className="text-sm text-gray-600 mb-2">📍 {ad.location}</p>
        )}
        <p className="text-sm text-gray-700 line-clamp-5">
          {ad.description || 'Aucune description disponible pour cette annonce.'}
        </p>
      </div>

      {/* --- Colonne droite : messagerie --- */}
      <div className="col-span-2 flex flex-col bg-gray-50 rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">Conversation</h2>

        <div className="flex-1 overflow-y-auto mb-4 p-3 bg-white rounded-lg">
          {conversation.messages.length > 0 ? (
            conversation.messages.map((msg) => {
              // ✅ Si le sender du message est le user connecté
              const isMine = msg.sender.id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`mb-3 p-2 rounded-lg max-w-xs ${
                    isMine ? 'bg-orange-100 ml-auto' : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 italic text-center">
              Aucun message pour le moment.
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
            placeholder="Écrire un message..."
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 rounded-lg font-semibold"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
