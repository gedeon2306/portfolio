import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { confirmLogin, storeAuthTokens } from '../../api/Auth';
import { useCheckCookies } from '../../utils/CheckCookies';
import { LuShieldAlert, LuArrowLeft, LuMoon, LuSun, LuCircleHelp } from 'react-icons/lu';
import './OtpVerification.css';
import logo from '../../assets/logo_jd_blanc_sbg.png';

export default function OtpVerification() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const rememberMe = searchParams.get('remember') === '1';

  // Code OTP à 6 chiffres
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs pour chaque input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Si un token est déjà présent (cookie), inutile de repasser par l'OTP
  useCheckCookies({ redirectIfAuthenticated: '/dashboard' });;

  // S'assurer que l'utilisateur provient bien de la page de login
  useEffect(() => {
    if (!uid || !token) {
      toast.error("Accès refusé", "Veuillez d'abord vous identifier.");
      navigate('/connexion');
    }
  }, []);

  // Focus le premier input au chargement
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return; // Uniquement des chiffres

    const newOtp = [...otp];
    // Garder seulement le dernier caractère saisi
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    setIsError(false);
    setErrorMessage(null);

    // Focus l'input suivant si on a saisi un chiffre
    if (val !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];

      if (otp[index] !== '') {
        // Supprime le contenu actuel
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Si l'input actuel est vide, on va sur le précédent et on le vide
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
      setIsError(false);
      setErrorMessage(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // On ne garde que les 6 premiers chiffres
    if (/^\d{1,6}$/.test(pastedData)) {
      const pastedChars = pastedData.split('');
      const newOtp = [...otp];

      for (let i = 0; i < 6; i++) {
        if (pastedChars[i] !== undefined) {
          newOtp[i] = pastedChars[i];
        }
      }
      setOtp(newOtp);
      setIsError(false);
      setErrorMessage(null);

      // Focus le dernier input rempli ou le bouton
      const focusIndex = Math.min(pastedChars.length, 5);
      inputRefs.current[focusIndex]?.focus();
    } else {
      toast.error('Erreur de collage', 'Le code collé doit contenir uniquement des chiffres.');
    }
  };

  // Soumission automatique si tous les champs sont remplis
  useEffect(() => {
    const code = otp.join('');
    if (code.length === 6 && !isLoading) {
      handleSubmitCode(code);
    }
  }, [otp]);

  const handleSubmitCode = async (code: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    if (!uid || !token) {
      toast.error('Erreur de session', 'Votre session de confirmation est expirée. Reconnectez-vous.');
      navigate('/connexion');
      return;
    }

    const apiKey = import.meta.env.VITE_PUBLIC_ADMIN_API_KEY

    if (!apiKey) {
      setErrorMessage('Qui étes vous ?.');
      toast.error('Désolé', 'Vous étes pas un JihrelDev.');
      return;
    }

    try {
      const response = await confirmLogin({ uid, token, code, apiKey });

      storeAuthTokens(response.access, response.refresh, rememberMe ? 30 : 1);

      toast.success('Accès autorisé !', 'Double facteur validé. Bienvenue sur la dashboard.');
      navigate('/dashboard');
    } catch (err: any) {
      const errorText = err?.response?.data?.error || 'Code de sécurité invalide. Veuillez réessayer.';
      setIsError(true);
      setErrorMessage(errorText);
      toast.error('Code incorrect', errorText);

      setTimeout(() => {
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setIsError(false);
    setErrorMessage(null);
    toast.info('Code de démo inséré', 'Le code "123456" a été rempli automatiquement.');
  };

  return (
    <div className="otp-page">
      <div className="otp-glow" />

      <div className="otp-card">
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

        <div className="otp-header">
          <div className="otp-badge badge badge-accent">
            <LuShieldAlert className="badge-icon" /> Double Authentification
          </div>
          <h1 className="otp-title">Saisir le code</h1>
          <p className="otp-subtitle">
            Saisissez le code de sécurité à 6 chiffres pour finaliser votre connexion.
          </p>
        </div>

        {errorMessage && (
          <div className="otp-alert-error" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className={`otp-inputs-row ${isError ? 'shake' : ''}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              ref={(el) => { inputRefs.current[index] = el; }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`otp-field ${digit !== '' ? 'filled' : ''}`}
              disabled={isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <div className="otp-options-row">
          <button
            type="button"
            className="back-to-login-btn"
            onClick={() => navigate('/connexion')}
            disabled={isLoading}
          >
            <LuArrowLeft className="btn-icon-left" />
            <span>Retour</span>
          </button>

          <button
            type="button"
            className="btn-demo-quick"
            onClick={handleDemoFill}
            disabled={isLoading}
          >
            <span>Code Démo (123456)</span>
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary otp-submit"
          onClick={() => handleSubmitCode(otp.join(''))}
          disabled={isLoading || otp.join('').length < 6}
        >
          {isLoading ? (
            <span className="btn-content loading">
              <span className="spinner" />
              <span>Vérification…</span>
            </span>
          ) : (
            <span className="btn-content">
              <span>Valider le code</span>
            </span>
          )}
        </button>

        <div className="otp-footer">
          <LuCircleHelp className="footer-icon" />
          <span>Portfolio Admin v2.0</span>
        </div>
      </div>
    </div>
  );
}