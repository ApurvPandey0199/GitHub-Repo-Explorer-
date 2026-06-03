import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/github'
});

const handleError = (error) => {
  const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unknown error occurred';
  const customError = new Error(message);
  customError.status = error.response?.status || 500;
  throw customError;
};

export const getUser = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRepos = async (username, { page = 1, sort = 'updated' } = {}) => {
  try {
    const response = await api.get(`/users/${username}/repos`, {
      params: { page, sort }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRepoDetails = async (owner, repo) => {
  try {
    const response = await api.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOrgs = async (username) => {
  try {
    const response = await api.get(`/users/${username}/orgs`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
