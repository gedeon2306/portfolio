import { useState } from 'react';
import {
  LuFileText,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuEye,
  LuTag,
  LuCalendar,
  LuCircleCheck,
  LuX
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import './Content.css';

type Article = {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'review';
  readTime: string;
  date: string;
  views: number;
};

const initialArticles: Article[] = [
  {
    id: 'a1',
    title: 'Pourquoi migrer vers React 19 et la nouvelle architecture du Compiler',
    category: 'Tutoriel React',
    status: 'published',
    readTime: '6 min',
    date: '02 Août 2026',
    views: 342,
  },
  {
    id: 'a2',
    title: 'Guide d’optimisation des micro-interactions CSS selon Emiel Kowalski',
    category: 'Design & UX',
    status: 'published',
    readTime: '8 min',
    date: '28 Juillet 2026',
    views: 520,
  },
  {
    id: 'a3',
    title: 'Construire une API REST Django scalable avec authentification JWT',
    category: 'Backend Django',
    status: 'draft',
    readTime: '12 min',
    date: '20 Juillet 2026',
    views: 0,
  },
  {
    id: 'a4',
    title: 'Mon workflow de développement avec Antigravity CLI et AI pairing',
    category: 'Productivité',
    status: 'review',
    readTime: '5 min',
    date: '15 Juillet 2026',
    views: 110,
  },
];

export default function Content() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tutoriel React');
  const [status, setStatus] = useState<'published' | 'draft' | 'review'>('published');

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || art.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Titre requis', 'Veuillez remplir le titre de l’article.');
      return;
    }

    const newArt: Article = {
      id: `a-${Date.now()}`,
      title: title.trim(),
      category,
      status,
      readTime: '5 min',
      date: 'Aujourd’hui',
      views: 0,
    };

    setArticles((prev) => [newArt, ...prev]);
    setIsModalOpen(false);
    setTitle('');
    toast.success('Article créé !', `L’article "${newArt.title}" a été ajouté.`);
  };

  const handleDelete = (id: string, artTitle: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.info('Article supprimé', `"${artTitle}" a été retiré.`);
  };

  return (
    <div className="content-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Publications & Blog</p>
          <h2>Gestion des Contenus</h2>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <LuPlus className="btn-icon" /> Nouvel Article
        </button>
      </div>

      {/* Stats rapides des contenus */}
      <div className="content-stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Articles publiés</span>
            <LuCircleCheck className="stat-icon" />
          </div>
          <p className="stat-value">{articles.filter((a) => a.status === 'published').length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Brouillons & Révisions</span>
            <FiEdit3 className="stat-icon" />
          </div>
          <p className="stat-value">{articles.filter((a) => a.status !== 'published').length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Lectures cumulées</span>
            <LuEye className="stat-icon" />
          </div>
          <p className="stat-value">{articles.reduce((acc, a) => acc + a.views, 0)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="search-input-wrap flex-1">
            <LuSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par titre ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="field-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="review">En révision</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Titre du contenu</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Vues</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Aucun article ne correspond à votre filtre.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="article-title-cell">
                        <LuFileText className="article-cell-icon" />
                        <span className="article-cell-title">{article.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-accent"><LuTag /> {article.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${article.status === 'published' ? 'badge-accent' : 'badge-neutral'}`}>
                        {article.status === 'published' && '● Publié'}
                        {article.status === 'draft' && '○ Brouillon'}
                        {article.status === 'review' && '◐ En révision'}
                      </span>
                    </td>
                    <td className="text-xs text-secondary font-mono">
                      <LuCalendar /> {article.date}
                    </td>
                    <td className="font-mono text-sm">{article.views}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-only"
                        onClick={() => toast.info('Aperçu', `Affichage de "${article.title}"`)}
                        title="Voir"
                      >
                        <LuEye />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-only danger"
                        onClick={() => handleDelete(article.id, article.title)}
                        title="Supprimer"
                      >
                        <LuTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Article */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Créer un Nouvel Article</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setIsModalOpen(false)}
              >
                <LuX />
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="atitle">Titre de l'article</label>
                <input
                  id="atitle"
                  type="text"
                  placeholder="Ex: Les nouveautés de React 19..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field">
                <label htmlFor="acat">Catégorie</label>
                <select
                  id="acat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field-select"
                >
                  <option value="Tutoriel React">Tutoriel React</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Backend Django">Backend Django</option>
                  <option value="Productivité">Productivité</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="astatus">Statut</label>
                <select
                  id="astatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="field-select"
                >
                  <option value="published">Publié immédiatement</option>
                  <option value="draft">Brouillon</option>
                  <option value="review">En révision</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreate}
              >
                Enregistrer l'article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
