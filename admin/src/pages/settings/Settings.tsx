import { useState } from 'react';
import {
  LuSettings,
  LuLock,
  LuMoon,
  LuKey,
  LuSave,
  LuDownload,
  LuCheck,
  LuCopy
} from 'react-icons/lu';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

export default function Settings() {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'api'>('general');

  // Form State
  const [siteName, setSiteName] = useState('Portfolio Gédéon Dupont');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [apiKey] = useState('pk_live_99a8b7c6d5e4f3a2b1_2026');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSaveGeneral = () => {
    toast.success('Paramètres enregistrés', 'Configuration du site mise à jour.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Champs manquants', 'Veuillez saisir votre mot de passe actuel et le nouveau.');
      return;
    }
    toast.success('Mot de passe mis à jour', 'Vos identifiants ont été modifiés avec succès.');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success('Clé copiée', 'Clé API copiée dans le presse-papier.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExportBackup = () => {
    toast.info('Sauvegarde en cours', 'Génération de l’archive JSON de la base de données...');
    setTimeout(() => {
      toast.success('Sauvegarde terminée', 'Fichier backup_portfolio_2026.json téléchargé.');
    }, 1200);
  };

  return (
    <div className="settings-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Administration Système</p>
          <h2>Paramètres de l’Application</h2>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleSaveGeneral}>
          <LuSave className="btn-icon" /> Enregistrer les paramètres
        </button>
      </div>

      {/* Onglets Settings */}
      <div className="myinfo-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <LuSettings /> Général & Notifications
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <LuLock /> Sécurité & Accès
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <LuMoon /> Apparence
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <LuKey /> API & Base de données
        </button>
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === 'general' && (
        <section className="panel-card tab-content">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Options générales</p>
              <h3>Préférences du Site & Notifications</h3>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="field">
              <label htmlFor="sitename">Titre global du Portfolio</label>
              <input
                id="sitename"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <p className="toggle-title">Mode Maintenance</p>
                <p className="toggle-desc">Affiche une page en construction pour les visiteurs du site public.</p>
              </div>
              <input
                type="checkbox"
                className="switch-checkbox"
                checked={maintenanceMode}
                onChange={(e) => {
                  setMaintenanceMode(e.target.checked);
                  toast.info(e.target.checked ? 'Mode Maintenance activé' : 'Site public en ligne');
                }}
              />
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <p className="toggle-title">Notifications par Email</p>
                <p className="toggle-desc">Recevez une alerte lorsqu’un visiteur soumet le formulaire de contact.</p>
              </div>
              <input
                type="checkbox"
                className="switch-checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
              />
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: SECURITE */}
      {activeTab === 'security' && (
        <section className="panel-card tab-content">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Authentification</p>
              <h3>Changer le Mot de Passe & 2FA</h3>
            </div>
          </div>

          <form className="settings-form-grid" onSubmit={handlePasswordChange}>
            <div className="field">
              <label htmlFor="curpass">Mot de passe actuel</label>
              <input
                id="curpass"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="newpass">Nouveau mot de passe</label>
              <input
                id="newpass"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-secondary self-start">
              Mettre à jour le mot de passe
            </button>

            <hr className="settings-divider" />

            <div className="toggle-row">
              <div className="toggle-info">
                <p className="toggle-title">Double Authentification (2FA)</p>
                <p className="toggle-desc">Renforce la sécurité lors de chaque connexion à la console admin.</p>
              </div>
              <input
                type="checkbox"
                className="switch-checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
              />
            </div>
          </form>
        </section>
      )}

      {/* TAB 3: APPARENCE */}
      {activeTab === 'appearance' && (
        <section className="panel-card tab-content">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Thème & Couleurs</p>
              <h3>Gestion de l'Apparence (3 Couleurs Stricte)</h3>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="toggle-row">
              <div className="toggle-info">
                <p className="toggle-title">Mode Sombre Actif</p>
                <p className="toggle-desc">Thème actuel : <strong>{theme === 'dark' ? 'Sombre (Black & Violet)' : 'Clair (White & Violet)'}</strong></p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={toggleTheme}>
                Changer de mode
              </button>
            </div>

            <div className="palette-preview-box">
              <p className="field-title">Charte Graphique Stricte</p>
              <div className="color-swatches">
                <div className="swatch swatch-white"><span>Blanc #FFFFFF</span></div>
                <div className="swatch swatch-black"><span>Noir #09090B</span></div>
                <div className="swatch swatch-violet"><span>Violet #7C3AED</span></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: API & BACKUP */}
      {activeTab === 'api' && (
        <section className="panel-card tab-content">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Données & Intégrations</p>
              <h3>Clés API REST & Export de Sauvegarde</h3>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="field">
              <label>Clé d'API Publique (Lecture Seule)</label>
              <div className="input-icon-wrap">
                <input type="text" value={apiKey} readOnly className="font-mono" />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={handleCopyApiKey}
                  title="Copier la clé"
                >
                  {copiedKey ? <LuCheck /> : <LuCopy />}
                </button>
              </div>
            </div>

            <hr className="settings-divider" />

            <div className="backup-box">
              <div className="backup-info">
                <h4>Sauvegarder les données du portfolio</h4>
                <p>Exporte l’ensemble des projets, compétences et configurations dans un fichier JSON réutilisable.</p>
              </div>
              <button type="button" className="btn btn-secondary" onClick={handleExportBackup}>
                <LuDownload className="btn-icon" /> Télécharger l'archive JSON
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
