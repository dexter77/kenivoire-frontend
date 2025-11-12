import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Search, MessageCircle, SlidersHorizontal } from "lucide-react";
import api from "../api/axiosConfig";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({
    prixMax: "",
    ville: "",
    categorie: "",
  });

  // --- Déconnexion ---
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // --- Récupération des messages non lus ---
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("messaging/unread/");
        setUnreadCount(res.data.unread_count || res.data.count || 0);
      } catch (err) {
        console.error("Erreur chargement messages non lus", err);
      }
    };

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // --- Recherche ---
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.append("q", search);
    if (filters.ville) params.append("ville", filters.ville);
    if (filters.prixMax) params.append("prix_max", filters.prixMax);
    if (filters.categorie) params.append("categorie", filters.categorie);

    navigate(`/ads?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo-web-transparent.png"
            alt="Ken-Ivoire"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-orange-600">
            Ken-Ivoire
          </span>
        </Link>

        {/* --- Barre de recherche (Desktop) --- */}
        <div className="hidden md:flex flex-col items-start w-1/2 relative">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full"
          >
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none px-2 text-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-600 hover:text-orange-600 mr-2"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button type="submit" className="text-gray-600 hover:text-orange-600">
              <Search size={22} />
            </button>
          </form>

          {/* --- Menu Filtres --- */}
          {showFilters && (
            <div className="absolute top-12 left-0 w-full bg-white shadow-lg border rounded-xl p-4 mt-2 z-50">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Ville"
                  value={filters.ville}
                  onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Prix max"
                  value={filters.prixMax}
                  onChange={(e) => setFilters({ ...filters, prixMax: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={filters.categorie}
                  onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-orange-600 text-white mt-4 py-2 rounded-lg font-semibold hover:bg-orange-700"
              >
                Appliquer les filtres
              </button>
            </div>
          )}
        </div>

        {/* --- Menu Desktop --- */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {/* --- Icône messages avec badge --- */}
              <Link to="/messages" className="relative">
                <MessageCircle className="w-6 h-6 text-gray-700 hover:text-orange-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                className="text-gray-700 hover:text-orange-600 font-medium flex items-center gap-1"
              >
                👤 {user.username}
              </Link>

              <Link
                to="/ads/new"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                + Publier
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500 font-medium"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* --- Menu Mobile --- */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* --- Menu déroulant Mobile --- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none px-2 text-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-600 hover:text-orange-600 mr-2"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button type="submit" className="text-gray-600 hover:text-orange-600">
              <Search size={20} />
            </button>
          </form>

          {showFilters && (
            <div className="bg-gray-50 p-3 rounded-lg border space-y-3">
              <input
                type="text"
                placeholder="Ville"
                value={filters.ville}
                onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Prix max"
                value={filters.prixMax}
                onChange={(e) => setFilters({ ...filters, prixMax: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={filters.categorie}
                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSearch}
                className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold"
              >
                Appliquer les filtres
              </button>
            </div>
          )}

          {user ? (
            <>
              <Link to="/messages" className="block text-gray-700 hover:text-orange-600">
                💬 Messages
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm bg-red-600 text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/account" className="block text-gray-700 hover:text-orange-600">
                👤 Mon compte
              </Link>
              <Link
                to="/ads/new"
                className="block bg-orange-600 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-orange-700"
              >
                + Publier
              </Link>
              <button
                onClick={handleLogout}
                className="block text-red-500 font-medium"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-orange-600 font-semibold hover:text-orange-700"
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
