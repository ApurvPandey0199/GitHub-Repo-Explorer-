require('dotenv').config();
const axios = require('axios');

const headers = {
  'Accept': 'application/vnd.github+json'
};

if (process.env.GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers
});

const fetchUser = async (username) => {
  const response = await githubAPI.get(`/users/${username}`);
  return response.data;
};

const fetchRepos = async (username, page = 1, sort = 'updated') => {
  const response = await githubAPI.get(`/users/${username}/repos`, {
    params: { per_page: 100, page, sort }
  });
  return response.data;
};

const fetchRepoDetails = async (owner, repo) => {
  const response = await githubAPI.get(`/repos/${owner}/${repo}`);
  return response.data;
};

const fetchOrgs = async (username) => {
  const response = await githubAPI.get(`/users/${username}/orgs`);
  return response.data;
};

module.exports = {
  githubAPI,
  fetchUser,
  fetchRepos,
  fetchRepoDetails,
  fetchOrgs
};
