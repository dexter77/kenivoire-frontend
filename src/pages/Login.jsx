import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setError("");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError("⚠️ " + JSON.stringify(err.response.data));
      } else {
        setError("⚠️ Identifiants incorrects");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Connexion
        </h2>

        {error && (
          <div className="alert alert-error text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              placeholder="Entrez votre nom d’utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-white font-semibold mt-3"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-orange-700 hover:underline font-medium"
          >
            S’inscrire
          </button>
        </p>
      </div>
    </div>
  );
}
