import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    prixMax: "",
    ville: "",
    categorie: "",
  });

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.append("q", search);
    if (filters.ville) params.append("ville", filters.ville);
    if (filters.prixMax) params.append("prix_max", filters.prixMax);
    if (filters.categorie) params.append("categorie", filters.categorie);

    navigate(`/ads?${params.toString()}`);
    setSearchOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo-web-transparent.png"
            alt="Ken-Ivoire"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-orange-600">Ken-Ivoire</span>
        </Link>

        {/* Barre de recherche */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-1/2">
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none px-2 text-gray-700"
          />
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600 hover:text-orange-600"
          >
            <Search size={22} />
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
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

        {/* Menu Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Filtres recherche */}
      {searchOpen && (
        <div className="bg-white border-t border-gray-200 shadow-md py-4">
          <form
            onSubmit={handleSearch}
            className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Mot-clé"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ville"
              value={filters.ville}
              onChange={(e) =>
                setFilters({ ...filters, ville: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={filters.prixMax}
              onChange={(e) =>
                setFilters({ ...filters, prixMax: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={filters.categorie}
              onChange={(e) =>
                setFilters({ ...filters, categorie: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Rechercher
            </button>
          </form>
        </div>
      )}

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/ads"
              className="text-gray-700 hover:text-orange-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Annonces
            </Link>

            {user ? (
              <>
                <Link
                  to="/account"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  👤 {user.username}
                </Link>
                <Link
                  to="/ads/new"
                  className="bg-orange-600 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  + Publier
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-500 font-medium text-left"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-orange-600 font-semibold hover:text-orange-700"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
