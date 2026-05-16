import axios from 'axios'

const api = axios.create(
    {
        baseURL: 'http://localhost:3001/api',
        timeout: 10000 // 10 second timeout for requests
    }
)

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle response errors globally
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    }

    // Return error for component handling
    return Promise.reject(error);
});

export default api