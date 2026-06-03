import { useState } from 'react';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [sort, setSort] = useState('updated');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (searchName) => {
    setUsername(searchName);
    // Fetch logic will be integrated later
  };

  return (
    <div className="app-container">
      <header className="header">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </header>
      
      <main className="main-content">
        {!username && !loading && !error && !user && (
          <div className="empty-state">
            <span role="img" aria-label="search icon" className="empty-icon">🔍</span>
            <p>Search for a GitHub user to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
