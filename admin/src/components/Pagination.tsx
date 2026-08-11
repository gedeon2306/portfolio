import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('…');

  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);
  const pages = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-shell">
      <p className="pagination-summary">
        Affichage{' '}
        <span className="pagination-summary-highlight">
          {from}–{to}
        </span>{' '}
        sur <span className="pagination-summary-highlight">{totalCount}</span> utilisateurs
      </p>

      <div className="pagination-actions">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-ghost pagination-nav"
        >
          <LuChevronLeft className="btn-icon" />
          <span>Précédent</span>
        </button>

        <div className="pagination-list">
          {pages.map((page, idx) =>
            page === '…' ? (
              <button
                key={`ellipsis-${idx}`}
                type="button"
                disabled
                aria-hidden="true"
                className="btn btn-ghost pagination-ellipsis"
              >
                …
              </button>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page as number)}
                className={`btn pagination-page ${
                  page === currentPage ? 'pagination-page--active' : 'btn-ghost'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-ghost pagination-nav"
        >
          <span>Suivant</span>
          <LuChevronRight className="btn-icon" />
        </button>
      </div>
    </div>
  );
}
