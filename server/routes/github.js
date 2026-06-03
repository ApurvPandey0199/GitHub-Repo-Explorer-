const express = require('express');
const router = express.Router();
const cache = require('../cache');
const { fetchUser, fetchRepos, fetchRepoDetails, fetchOrgs } = require('../github');

// GET /api/github/users/:username
router.get('/users/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `user_${username}`;
  
  const cachedUser = cache.get(cacheKey);
  if (cachedUser) {
    return res.json(cachedUser);
  }
  
  try {
    const data = await fetchUser(username);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET /api/github/users/:username/repos
router.get('/users/:username/repos', async (req, res) => {
  const { username } = req.params;
  const { page = 1, sort = 'updated' } = req.query;
  const cacheKey = `repos_${username}_${page}_${sort}`;
  
  const cachedRepos = cache.get(cacheKey);
  if (cachedRepos) {
    return res.json(cachedRepos);
  }
  
  try {
    const data = await fetchRepos(username, page, sort);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET /api/github/repos/:owner/:repo
router.get('/repos/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const cacheKey = `repo_${owner}_${repo}`;
  
  const cachedRepo = cache.get(cacheKey);
  if (cachedRepo) {
    return res.json(cachedRepo);
  }
  
  try {
    const data = await fetchRepoDetails(owner, repo);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET /api/github/users/:username/orgs
router.get('/users/:username/orgs', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `orgs_${username}`;
  
  const cachedOrgs = cache.get(cacheKey);
  if (cachedOrgs) {
    return res.json(cachedOrgs);
  }
  
  try {
    const data = await fetchOrgs(username);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
