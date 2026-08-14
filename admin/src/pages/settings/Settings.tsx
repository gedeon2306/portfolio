import { useState, useEffect } from 'react';
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
import {
  fetchSettings,
  saveSettings,
  fetchSecuritySettings,
  updateSecuritySettings,
  changePassword,
  downloadBackup,
} from '../../api/Actions';
import './Settings.css';

export default function Settings() {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'api'>('general');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Form State
  const [siteName, setSiteName] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [backupLoading, setBackupLoading] = useState(false);

  // Onglet API : laissé tel quel, sans backend
  const [apiKey] = useState('pk_live_99a8b7c6d5e4f3a2b1_2026');
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, securityRes] = await Promise.all([
          fetchSettings(),
          fetchSecuritySettings(),
        ]);

        if (settingsRes.settings) {
          setSiteName(settingsRes.settings.titre_app);
          setMaintenanceMode(settingsRes.settings.mode_maintenance);
          setEmailNotifs(settingsRes.settings.notification_email);
        }
        setTwoFactorAuth(securityRes.two_factor_auth);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Impossible de charger les paramètres.';
        toast.error('Erreur', message);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [toast]);

  const handleSaveGeneral = async () => {
    if (!siteName.trim()) {
      toast.error('Champ requis', 'Le titre du site ne peut pas être vide.');
      return;
    }

    setSavingGeneral(true);
    try {
      await saveSettings({
        titre_app: siteName.trim(),
        mode_maintenance: maintenanceMode,
        notification_email: emailNotifs,
      });
      toast.success('Paramètres enregistrés', 'Configuration du site mise à jour.');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible d'enregistrer les paramètres.";
      toast.error('Erreur', message);
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleMaintenanceToggle = (checked: boolean) => {
    setMaintenanceMode(checked);
    toast.info(checked ? 'Mode Maintenance activé' : 'Site public en ligne');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Champs manquants', 'Veuillez saisir votre mot de passe actuel et le nouveau.');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success('Mot de passe mis à jour', 'Vos identifiants ont été modifiés avec succès.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de mettre à jour le mot de passe.';
      toast.error('Erreur', message);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleTwoFactorToggle = async (checked: boolean) => {
    const previous = twoFactorAuth;
    setTwoFactorAuth(checked);
    try {
      await updateSecuritySettings(checked);
      toast.success(
        checked ? '2FA activée' : '2FA désactivée',
        checked
          ? 'Un code de confirmation sera demandé à chaque connexion.'
          : 'La connexion se fera désormais sans code de confirmation.'
      );
    } catch (err) {
      setTwoFactorAuth(previous);
      const message = err instanceof Error ? err.message : 'Impossible de modifier la 2FA.';
      toast.error('Erreur', message);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success('Clé copiée', 'Clé API copiée dans le presse-papier.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExportBackup = async () => {
    setBackupLoading(true);
    toast.info('Sauvegarde en cours', 'Génération de l\u2019archive JSON de la base de données...');
    try {
      await downloadBackup();
      toast.success('Sauvegarde terminée', 'Le fichier JSON a été téléchargé.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de générer la sauvegarde.';
      toast.error('Erreur', message);
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Administration Système</p>
          <h2>Paramètres de l’Application</h2>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveGeneral}
          disabled={savingGeneral || loadingInitial}
        >
          <LuSave className="btn-icon" /> {savingGeneral ? 'Enregistrement...' : 'Enregistrer les paramètres'}
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

          {loadingInitial ? (
            <p>Chargement des paramètres...</p>
          ) : (
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
                  onChange={(e) => handleMaintenanceToggle(e.target.checked)}
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
          )}
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

            <button type="submit" className="btn btn-secondary self-start" disabled={passwordSubmitting}>
              {passwordSubmitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
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
                disabled={loadingInitial}
                onChange={(e) => handleTwoFactorToggle(e.target.checked)}
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportBackup}
                disabled={backupLoading}
              >
                <LuDownload className="btn-icon" /> {backupLoading ? 'Génération...' : "Télécharger l'archive JSON"}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}