import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    birth_date: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("⚠️ Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("⚠️ Les mots de passe ne correspondent pas.");
      return;
    }

    const requiredFields = ['email', 'username', 'password', 'first_name', 'last_name', 'city', 'birth_date'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());

    if (emptyFields.length > 0) {
      setError("⚠️ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const res = await registerUser(formData);
      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.data) {
        setError("⚠️ " + JSON.stringify(err.response.data));
      } else {
        setError("⚠️ Erreur lors de l’inscription");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Créez votre compte
        </h2>

        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom & Prénom */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="Ex: Marie"
                value={formData.first_name}
                onChange={handleChange}
                className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Ex: Diallo"
                value={formData.last_name}
                onChange={handleChange}
                className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Téléphone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
            />
          </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Nom d’utilisateur */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              name="username"
              placeholder="Votre pseudo"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="password2"
              placeholder="••••••••"
              value={formData.password2}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Ville
            </label>
            <input
              type="text"
              name="city"
              placeholder="Ex: Abidjan"
              value={formData.city}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="input input-bordered w-full focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="btn bg-orange-600 hover:bg-orange-700 w-full text-white font-semibold mt-3"
          >
            S’inscrire
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà inscrit ?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-orange-700 hover:underline font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
