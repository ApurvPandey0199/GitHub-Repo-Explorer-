import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    
    // Validate (^[a-zA-Z0-9-]{1,39}$)
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(trimmed)) {
      setError('Invalid GitHub username');
      return;
    }
    
    setError('');
    onSearch(trimmed);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for a GitHub user..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.searchButton}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </form>
  );
}
