import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Spinner } from '../../components/Spinner';
import { LuLogIn, LuSun, LuMoon } from "react-icons/lu";
import './Login.css';
import logo from '../../assets/logo_jd_blanc_sbg.png';


export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    // TODO: brancher sur l'authentification (Django JWT)
    console.log({ username, password });

    setIsLoading(true);
    // Le vrai appel API remplacera ce délai ; navigate() se fera dans le .then()
    // Redirection volontaire après 3 secondes pour l'effet de chargement
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-wrap">
          <div className="logo-mark">
            <img src={logo} alt="Logo" />
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair'}
          >
            {theme === 'light' ? <LuMoon /> : <LuSun />}
          </button>
        </div>

        <h1 className="login-title">Bon retour</h1>
        <p className="login-subtitle text-secondary">
          Connectez-vous pour accéder à votre espace.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Utilisateur</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Votre identifiant"
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-content loading">
                <Spinner />
                <span className="btn-text">Connexion…</span>
              </span>
            ) : (
              <span className="btn-content">
                <LuLogIn className="btn-icon" />
                <span className="btn-text">Se connecter</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}