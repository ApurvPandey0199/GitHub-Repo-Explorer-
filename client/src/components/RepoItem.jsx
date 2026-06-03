import { useState } from 'react';
import { getRepoDetails } from '../api/github';
import styles from './RepoItem.module.css';

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584'
};

const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const timeMs = new Date(dateString).getTime();
  const deltaMs = timeMs - Date.now();
  const deltaDays = Math.round(deltaMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(deltaDays) > 30) {
    const deltaMonths = Math.round(deltaDays / 30);
    return rtf.format(deltaMonths, 'month');
  }
  return rtf.format(deltaDays, 'day');
};

export default function RepoItem({ repo }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const langColor = languageColors[repo.language] || '#8b949e';

  const handleExpand = async () => {
    if (!expanded && !details) {
      setLoading(true);
      setError(null);
      try {
        const owner = repo.owner?.login || repo.full_name.split('/')[0];
        const data = await getRepoDetails(owner, repo.name);
        setDetails(data);
      } catch (err) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div className={styles.repoItem}>
      <div className={styles.mainContent} onClick={handleExpand}>
        <div className={styles.header}>
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.name}
            onClick={(e) => e.stopPropagation()}
          >
            {repo.name}
          </a>
        </div>
        
        {repo.description && <p className={styles.description}>{repo.description}</p>}
        
        <div className={styles.footer}>
          {repo.language && (
            <div className={styles.stat}>
              <span className={styles.langColor} style={{ backgroundColor: langColor }}></span>
              {repo.language}
            </div>
          )}
          <div className={styles.stat}>
            ⭐ {repo.stargazers_count}
          </div>
          <div className={styles.stat}>
            🔀 {repo.forks_count}
          </div>
          <div className={styles.stat}>
            👀 {repo.watchers_count}
          </div>
          <div className={styles.stat}>
            Updated {getRelativeTime(repo.updated_at)}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className={styles.expandedContent}>
          {loading && <div className={styles.spinner}>Loading details...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {details && !loading && !error && (
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Open Issues</span>
                <span className={styles.detailValue}>{details.open_issues_count}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Default Branch</span>
                <span className={styles.detailValue}>{details.default_branch}</span>
              </div>
              {details.license && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>License</span>
                  <span className={styles.detailValue}>{details.license.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
