import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading, initialValue = '' }) {
  const [input, setInput] = useState(initialValue);
  const [error, setError] = useState('');
  
  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed.length >= 2 && !isLoading && trimmed !== initialValue) {
      if (/^[a-zA-Z0-9-]{1,39}$/.test(trimmed)) {
        setError('');
        onSearch(trimmed);
      } else {
        setError('Invalid GitHub username');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

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
          aria-label="GitHub username search"
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
