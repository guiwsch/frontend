import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se não houver resposta (backend não disponível), apenas rejeita o erro
    // Não tenta renovar token se o backend não está respondendo
    if (!error.response) {
      // Backend não está disponível - apenas loga o erro
      console.warn('Backend não está disponível:', error.message);
      return Promise.reject(error);
    }

    // Se o erro for 401 e não for uma tentativa de renovação
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('Nenhum refresh token encontrado');
        }

        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar ao renovar, fazer logout apenas se estiver em rota protegida
        // Não redireciona se estiver em página pública
        if (window.location.pathname.startsWith('/admin')) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
