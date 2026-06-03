require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development server
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// In-Memory Cache Implementation
class MemoryCache {
  constructor(ttlMs = 60000) { // Default 60 seconds TTL
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  get(key) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    const isExpired = Date.now() - cachedItem.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    return cachedItem.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const apiCache = new MemoryCache(60000); // 60s TTL cache

// Helper function to build GitHub API headers
const getGithubHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'github-repo-explorer-backend'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

// Route: Get user profile info
app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username.trim().toLowerCase();
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cacheKey = `user:${username}`;
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    console.log(`[Cache Hit] User profile: ${username}`);
    return res.json(cachedData);
  }

  console.log(`[Cache Miss] Fetching profile from GitHub: ${username}`);
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: getGithubHeaders()
    });
    
    const userProfile = {
      login: response.data.login,
      id: response.data.id,
      avatar_url: response.data.avatar_url,
      html_url: response.data.html_url,
      name: response.data.name,
      company: response.data.company,
      blog: response.data.blog,
      location: response.data.location,
      bio: response.data.bio,
      twitter_username: response.data.twitter_username,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      created_at: response.data.created_at
    };

    apiCache.set(cacheKey, userProfile);
    return res.json(userProfile);
  } catch (error) {
    console.error(`Error fetching user profile for ${username}:`, error.message);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ error: 'GitHub user not found' });
      }
      if (status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        return res.status(403).json({ 
          error: 'GitHub API rate limit exceeded. Please add GITHUB_TOKEN to backend/.env to increase limits.' 
        });
      }
      return res.status(status).json({ error: error.response.data.message || 'GitHub API error' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Get user's repositories
app.get('/api/user/:username/repos', async (req, res) => {
  const username = req.params.username.trim().toLowerCase();

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cacheKey = `repos:${username}`;
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    console.log(`[Cache Hit] Repos: ${username}`);
    return res.json(cachedData);
  }

  console.log(`[Cache Miss] Fetching repos from GitHub: ${username}`);
  try {
    let repositories = [];
    let page = 1;
    let hasNextPage = true;
    const maxPages = 3; // Limit to 300 repos to prevent server hang or rate limit exhaustion

    while (hasNextPage && page <= maxPages) {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          per_page: 100,
          page: page,
          type: 'all'
        },
        headers: getGithubHeaders()
      });

      repositories = repositories.concat(response.data);
      
      // Check link headers to see if next page exists
      const linkHeader = response.headers['link'];
      if (linkHeader && linkHeader.includes('rel="next"') && response.data.length === 100) {
        page++;
      } else {
        hasNextPage = false;
      }
    }

    // Process and sanitize the repositories list
    const parsedRepos = repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      fork: repo.fork, // true if it's a fork
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      homepage: repo.homepage,
      size: repo.size,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      language: repo.language,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      license: repo.license ? repo.license.spdx_id : null
    }));

    apiCache.set(cacheKey, parsedRepos);
    return res.json(parsedRepos);
  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error.message);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ error: 'GitHub user not found' });
      }
      if (status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        return res.status(403).json({ 
          error: 'GitHub API rate limit exceeded. Please add GITHUB_TOKEN to backend/.env to increase limits.' 
        });
      }
      return res.status(status).json({ error: error.response.data.message || 'GitHub API error' });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Root check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', cacheSize: apiCache.cache.size });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
