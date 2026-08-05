import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuSearch,
  LuLayoutDashboard,
  LuUserRound,
  LuFolderKanban,
  LuSettings,
  LuMoon,
  LuSun,
  LuX,
  LuSparkles,
  LuAward,
  LuChartColumn
} from 'react-icons/lu';
import { ImParagraphLeft } from 'react-icons/im';
import { useTheme } from '../context/ThemeContext';
import '../css/CommandPalette.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nav-dashboard',
      label: 'Tableau de bord',
      category: 'Navigation',
      icon: LuLayoutDashboard,
      run: () => navigate('/dashboard'),
    },
    {
      id: 'nav-myinfo',
      label: 'Mes informations (Profil)',
      category: 'Navigation',
      icon: LuUserRound,
      run: () => navigate('/dashboard/myinfo'),
    },
    {
      id: 'nav-skills',
      label: 'Compétences (Skills)',
      category: 'Navigation',
      icon: ImParagraphLeft,
      run: () => navigate('/dashboard/skills'),
    },
    {
      id: 'nav-projects',
      label: 'Projets portfolio',
      category: 'Navigation',
      icon: LuFolderKanban,
      run: () => navigate('/dashboard/projects'),
    },
    {
      id: 'nav-certificates',
      label: 'Certificats & Accréditations',
      category: 'Navigation',
      icon: LuAward,
      run: () => navigate('/dashboard/certificates'),
    },
    {
      id: 'nav-analytics',
      label: 'Statistiques & Vues',
      category: 'Navigation',
      icon: LuChartColumn,
      run: () => navigate('/dashboard/analytics'),
    },
    {
      id: 'nav-settings',
      label: 'Paramètres',
      category: 'Navigation',
      icon: LuSettings,
      run: () => navigate('/dashboard/settings'),
    },
    {
      id: 'action-theme',
      label: `Basculez en mode ${theme === 'light' ? 'sombre' : 'clair'}`,
      category: 'Actions',
      icon: theme === 'light' ? LuMoon : LuSun,
      run: () => toggleTheme(),
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (run: () => void) => {
    run();
    onClose();
  };

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cmd-header">
          <LuSearch className="cmd-search-icon" />
          <input
            type="text"
            className="cmd-input"
            placeholder="Rechercher une page ou une action... (Échap pour fermer)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="button" className="cmd-close" onClick={onClose} aria-label="Fermer">
            <LuX />
          </button>
        </div>

        <div className="cmd-results">
          {filteredActions.length === 0 ? (
            <div className="cmd-empty">
              <LuSparkles className="cmd-empty-icon" />
              <p>Aucun résultat pour « {query} »</p>
            </div>
          ) : (
            filteredActions.map(({ id, label, category, icon: Icon, run }) => (
              <button
                key={id}
                type="button"
                className="cmd-item"
                onClick={() => handleSelect(run)}
              >
                <div className="cmd-item-left">
                  <Icon className="cmd-item-icon" />
                  <span>{label}</span>
                </div>
                <span className="cmd-item-badge">{category}</span>
              </button>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span>Utilisez <kbd>↑</kbd> <kbd>↓</kbd> pour naviguer, <kbd>↵</kbd> pour sélectionner</span>
          <span className="cmd-shortcut"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
        </div>
      </div>
    </div>
  );
};
