import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Добавляем перехватчик для установки токена авторизации
axiosConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Удаляем Content-Type для FormData
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
    return config;
});

// Добавляем перехватчик для обработки ошибок
axiosConfig.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Можно добавить редирект на страницу логина
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const setupAxios = async () => {
    try {
        // Получаем CSRF токен
        await axiosConfig.get('/sanctum/csrf-cookie');
        
        // Устанавливаем CSRF токен в заголовки
        const token = document.querySelector('meta[name="csrf-token"]')?.content;
        if (token) {
            axiosConfig.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }
    } catch (error) {
        console.error('Failed to setup CSRF protection:', error);
    }
};

export default axiosConfig; 