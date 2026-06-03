import { useState } from 'react';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import ProfileCard from './components/ProfileCard';
import Organizations from './components/Organizations';
import LanguageChart from './components/LanguageChart';
import SortControls from './components/SortControls';
import RepoList from './components/RepoList';
import Skeleton from './components/Skeleton';
import ErrorMessage from './components/ErrorMessage';
import { getUser, getRepos, getOrgs } from './api/github';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [repos, setRepos] = useState([]);
  const [sort, setSort] = useState('updated');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentTrigger, setRecentTrigger] = useState(null);

  const fetchUserAndRepos = async (searchName) => {
    setLoading(true);
    setError(null);
    setUser(null);
    setOrgs([]);
    setRepos([]);
    setPage(1);
    
    try {
      const userData = await getUser(searchName);
      setUser(userData);
      
      const orgsData = await getOrgs(searchName);
      setOrgs(orgsData || []);
      
      const reposData = await getRepos(searchName, { page: 1, sort });
      setRepos(reposData);
      setHasMore(reposData.length === 100);
      setRecentTrigger(userData.login);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchName) => {
    if (searchName === username) return;
    setUsername(searchName);
    fetchUserAndRepos(searchName);
  };

  const handleSortChange = async (newSort) => {
    setSort(newSort);
    setPage(1);
    if (!username) return;
    
    setLoading(true);
    try {
      const reposData = await getRepos(username, { page: 1, sort: newSort });
      setRepos(reposData);
      setHasMore(reposData.length === 100);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    try {
      const reposData = await getRepos(username, { page: nextPage, sort });
      setRepos((prev) => [...prev, ...reposData]);
      setHasMore(reposData.length === 100);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={username} />
        <RecentSearches onSelect={handleSearch} triggerSave={recentTrigger} />
      </header>
      
      <main className="main-content">
        {!username && !loading && !error && !user && (
          <div className="empty-state">
            <span role="img" aria-label="search icon" className="empty-icon">🔍</span>
            <p>Search for a GitHub user to get started</p>
          </div>
        )}
        
        {loading && !user && <Skeleton />}
        
        {error && <ErrorMessage error={error} onRetry={() => fetchUserAndRepos(username)} />}
        
        {user && !error && (
          <>
            <div className="left-column">
              <ProfileCard user={user} />
              <Organizations orgs={orgs} />
              <LanguageChart repos={repos} />
            </div>
            <div className="repos-section">
              <SortControls sort={sort} onChange={handleSortChange} />
              <RepoList repos={repos} hasMore={hasMore} onLoadMore={handleLoadMore} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
