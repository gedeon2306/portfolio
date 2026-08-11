import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { loginUser, storeAuthTokens } from '../../api/Auth';
import { useCheckCookies } from '../../utils/CheckCookies';
import { LuLogIn, LuSun, LuMoon, LuEye, LuEyeOff, LuLock, LuUser, LuSparkles, LuCircleHelp } from 'react-icons/lu';
import './Login.css';
import logo from '../../assets/logo_jd_blanc_sbg.png';

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Si un token est déjà présent (cookie), inutile de repasser par le login
  useCheckCookies({ redirectIfAuthenticated: '/dashboard' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      toast.error('Erreur de connexion', 'Email et mot de passe requis.');
      return;
    }

    const apiKey = import.meta.env.VITE_PUBLIC_ADMIN_API_KEY

    if (!apiKey) {
      setErrorMessage('Qui étes vous ?.');
      toast.error('Désolé', 'Vous étes pas un JihrelDev.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
        apiKey,
      });

      const persistDays = rememberMe ? 30 : 1;

      if (response.dfa) {
        const params = new URLSearchParams({
          uid: response.uid,
          token: response.token,
          remember: rememberMe ? '1' : '0',
        }).toString();

        toast.success('Identifiants valides !', 'Un email de confirmation vient d’être envoyé.');
        navigate(`/connexion/otp?${params}`);
      } else {
        storeAuthTokens(response.access, response.refresh, persistDays);
        toast.success('Connexion réussie', 'Bienvenue sur l’administration.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorText = err?.response?.data?.error || 'Identifiants incorrects. Veuillez réessayer.';
      setErrorMessage(errorText);
      toast.error('Échec de la connexion', errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@example.com');
    setPassword('portfolio2026');
    toast.info('Démo préremplie', 'Cliquez sur "Se connecter" pour accéder.');
  };

  return (
    <div className="login-page">
      {/* Halo lumineux d'arrière-plan */}
      <div className="login-glow" />

      <div className="login-card">
        {/* En-tête de la carte avec Logo & Mode Sombre */}
        <div className="logo-wrap">
          <div className="logo-mark">
            <img src={logo} alt="Logo JD" />
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <LuMoon /> : <LuSun />}
          </button>
        </div>

        <div className="login-header">
          <div className="login-badge badge badge-accent">
            <LuSparkles className="badge-icon" /> Espace Sécurisé
          </div>
          <h1 className="login-title">Connexion Administration</h1>
          <p className="login-subtitle">
            Gérez l’ensemble de votre portfolio, vos compétences et vos projets.
          </p>
        </div>

        {errorMessage && (
          <div className="login-alert-error" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-icon-wrap">
              <LuUser className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: admin@exemple.com"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="password">Mot de passe</label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => toast.info('Aide connexion', 'Contactez le support pour réinitialiser le mot de passe.')}
              >
                Oublié ?
              </button>
            </div>
            <div className="input-icon-wrap">
              <LuLock className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Rester connecté</span>
            </label>

            <button type="button" className="btn-demo-quick" onClick={handleDemoFill}>
              Remplir Démo
            </button>
          </div>

          <button type="submit" className="btn btn-primary login-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-content loading">
                <span className="spinner" />
                <span>Authentification…</span>
              </span>
            ) : (
              <span className="btn-content">
                <LuLogIn className="btn-icon" />
                <span>Se connecter</span>
              </span>
            )}
          </button>
        </form>

        <div className="login-footer">
          <LuCircleHelp className="footer-icon" />
          <span>Portfolio Admin v2.0</span>
        </div>
      </div>
    </div>
  );
}