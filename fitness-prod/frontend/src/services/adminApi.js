import axios from 'axios';

const USER_API    = 'http://localhost:8081/api';
const WORKOUT_API = 'http://localhost:8082/api';
const AI_API      = 'http://localhost:8083/api';

// Attach JWT token automatically
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('fitness_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── ADMIN: USER SERVICE ─────────────────────────────
export const getAllUsers  = ()       => axios.get(`${USER_API}/users/all`);
export const deleteUser  = (userId) => axios.delete(`${USER_API}/users/${userId}`);
export const makeAdmin   = (userId) => axios.put(`${USER_API}/users/${userId}/make-admin`);

// ─── ADMIN: WORKOUT SERVICE ──────────────────────────
export const getAllWorkouts = () => axios.get(`${WORKOUT_API}/workouts/all`);

// ─── ADMIN: AI SERVICE ───────────────────────────────
export const getAllRecommendations = () => axios.get(`${AI_API}/recommendations/all`);
