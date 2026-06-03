import { useState, useEffect } from 'react';
import styles from './RecentSearches.module.css';

export default function RecentSearches({ onSelect, triggerSave }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gh-recent');
      if (stored) {
        setRecent(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  useEffect(() => {
    if (triggerSave) {
      setRecent((prev) => {
        const updated = [triggerSave, ...prev.filter(u => u !== triggerSave)].slice(0, 5);
        localStorage.setItem('gh-recent', JSON.stringify(updated));
        return updated;
      });
    }
  }, [triggerSave]);

  const handleClear = () => {
    localStorage.removeItem('gh-recent');
    setRecent([]);
  };

  if (recent.length === 0) return null;

  return (
    <div className={styles.container}>
      <span className={styles.label}>Recent:</span>
      <div className={styles.chips}>
        {recent.map((username) => (
          <button 
            key={username} 
            className={styles.chip} 
            onClick={() => onSelect(username)}
          >
            {username}
          </button>
        ))}
      </div>
      <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
    </div>
  );
}
