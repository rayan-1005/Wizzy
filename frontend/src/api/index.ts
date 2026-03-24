import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (d: { email: string; password: string; name: string; monthlyIncome: number }) =>
  api.post('/auth/register', d);
export const login = (d: { email: string; password: string }) =>
  api.post('/auth/login', d);
export const logout = (refreshToken: string) =>
  api.post('/auth/logout', { refreshToken });

// User
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (d: object) => api.patch('/user/profile', d);

// Expenses
export const createExpense = (d: object) => api.post('/expenses', d);
export const listExpenses = (p?: object) => api.get('/expenses', { params: p });
export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);
export const updateExpense = (id: string, d: object) => api.patch(`/expenses/${id}`, d);

// Goals
export const createGoal = (d: object) => api.post('/goals', d);
export const listGoals = () => api.get('/goals');
export const updateGoal = (id: string, d: object) => api.patch(`/goals/${id}`, d);
export const deleteGoal = (id: string) => api.delete(`/goals/${id}`);

// Quests
export const getTodayQuests = () => api.get('/quests/today');
export const completeQuest = (id: string) => api.patch(`/quests/${id}/complete`);
export const getQuestHistory = () => api.get('/quests/history');

// Boss Battles
export const getActiveBosses = () => api.get('/bosses');
export const attackBoss = (id: string, reduction: number) =>
  api.patch(`/bosses/${id}/health`, { reduction });

// Insights
export const getDashboard = () => api.get('/insights/dashboard');
export const getCategories = () => api.get('/insights/categories');
export const getTrends = () => api.get('/insights/trends');
export const getAnomalies = () => api.get('/insights/anomalies');
export const getCoaching = () => api.get('/insights/coaching');

// Progression
export const getProgression = () => api.get('/user/profile');

export default api;
