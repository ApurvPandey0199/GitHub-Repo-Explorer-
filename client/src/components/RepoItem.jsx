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
  const langColor = languageColors[repo.language] || '#8b949e';

  return (
    <div className={styles.repoItem}>
      <div className={styles.header}>
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.name}>
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
          Updated {getRelativeTime(repo.updated_at)}
        </div>
      </div>
    </div>
  );
}
