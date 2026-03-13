import axios from 'axios';

const USER_API    = 'http://localhost:8081/api/users';
const WORKOUT_API = 'http://localhost:8082/api/workouts';
const AI_API      = 'http://localhost:8083/api/recommendations';
const NOTIF_API   = 'http://localhost:8084/api/notifications';

// Attach JWT token to every request automatically
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('fitness_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-logout on 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('fitness_token');
            localStorage.removeItem('fitness_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ─── USER SERVICE ────────────────────────────────────────────────
export const registerUser   = (data)   => axios.post(`${USER_API}/register`, data);
export const loginUser      = (data)   => axios.post(`${USER_API}/login`, data);
export const getUserProfile = (userId) => axios.get(`${USER_API}/${userId}`);
export const updateUserProfile = (userId, data) => axios.put(`${USER_API}/${userId}`, data);

// ─── WORKOUT SERVICE ─────────────────────────────────────────────
export const logWorkout = (data) => axios.post(`${WORKOUT_API}`, data);
export const getUserWorkouts = (userId) => axios.get(`${WORKOUT_API}/user/${userId}`);
export const deleteWorkout = (workoutId) => axios.delete(`${WORKOUT_API}/${workoutId}`);

// ─── AI SERVICE ──────────────────────────────────────────────────
export const generateRecommendation = (userId, workoutId) =>
  axios.post(`${AI_API}/generate?userId=${userId}&workoutId=${workoutId}`);
export const getUserRecommendations = (userId) => axios.get(`${AI_API}/user/${userId}`);

// ─── NOTIFICATION SERVICE ────────────────────────────────────────
export const getUserNotifications = (userId) => axios.get(`${NOTIF_API}/user/${userId}`);
export const sendWorkoutNotification = (userId, userEmail, workoutTitle) =>
  axios.post(`${NOTIF_API}/workout?userId=${userId}&userEmail=${userEmail}&workoutTitle=${workoutTitle}`);
