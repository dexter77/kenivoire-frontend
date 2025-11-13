import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../api/axiosConfig";

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Récupération du token
  const access = localStorage.getItem("access");
  const authHeaders = access ? { Authorization: `Bearer ${access}` } : {};

  // 🔹 Récupération de l'utilisateur courant
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!access) return;
      try {
        const res = await api.get("auth/me/", {
          headers: authHeaders,
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Erreur de récupération de l'utilisateur courant:", err);
      }
    };
    fetchCurrentUser();
  }, [access]);

  // --- Fetch annonce ---
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`ads/${id}/`);
        setAd(res.data);
        const imgs = [res.data.image, res.data.image2, res.data.image3].filter(Boolean);
        setMainImage(imgs[0] || "/placeholder.png");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  // --- Fetch conversations (une seule fois) ---
  useEffect(() => {
    const fetchConversations = async () => {
      if (!access) return;
      try {
        const res = await api.get("messaging/conversations/", {
          headers: authHeaders,
        });
        setConversations(res.data.results || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [access]); // dépendance stable

  if (loading) return <p className="text-center mt-10">Chargement de l'annonce...</p>;
  if (!ad) return <p className="text-center mt-10 text-red-600">Annonce introuvable</p>;

  const images = [ad.image, ad.image2, ad.image3].filter(Boolean);
  const isMyAd = currentUser && ad.owner && currentUser.id === ad.owner.id;

  return (
    <div className="max-w-6xl mx-auto my-8 p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* --- Colonne gauche : Détails de l’annonce --- */}
      <main className="md:col-span-2 bg-white shadow-md rounded-lg p-5">
        {/* Galerie */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="relative w-full pb-[56.25%] mb-4">
              <img
                src={mainImage}
                alt={ad.title}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${ad.title} - ${idx + 1}`}
                    onClick={() => setMainImage(img)}
                    className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                      mainImage === img ? "border-orange-500" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{ad.title}</h1>
          <span className="text-orange-600 font-semibold text-xl">{ad.price} FCFA</span>
        </div>

        {ad.categorie?.name && (
          <p className="text-sm text-gray-500 mb-2">
            Catégorie : <span className="font-medium">{ad.categorie.name}</span>
          </p>
        )}

        <p className="text-gray-700 mb-4">{ad.description}</p>

        {ad.created_at && (
          <p className="text-sm text-gray-500">
            Publié le {dayjs(ad.created_at).format("DD/MM/YYYY")}
          </p>
        )}
          <p className="text-gray-500 text-sm mt-2">
            👁️ {ad.views}
          </p>
      </main>

      {/* --- Colonne droite : Informations du vendeur et bouton --- */}
      <aside className="md:col-span-1 bg-white shadow-md rounded-lg p-5 h-fit border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Vendu par</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Nom :</strong> {ad.owner?.username || "Utilisateur inconnu"}
          </p>
          <p>
            <strong>📞 Téléphone :</strong> {ad.owner?.phone || "Non renseigné"}
          </p>
        </div>

        {isMyAd ? (
  <p className="text-gray-500 mt-4 text-center italic">
    C’est votre annonce
  </p>
) : (
  <button
    onClick={async () => {
      if (!access) return navigate("/login");

      const existing = conversations.find(c => c.ad?.id === ad.id);
      if (existing) return navigate(`/messages/${existing.id}`);

      try {
        const res = await api.post(
          "messaging/conversations/",
          { ad: ad.id },
          { headers: authHeaders }
        );
        navigate(`/messages/${res.data.id}`);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la création de la conversation.");
      }
    }}
    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold mt-4 w-full"
  >
    Contacter le vendeur
  </button>
)}

      </aside>
    </div>
  );
}
