import { TOKEN_KEY } from '@/constant/var';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 全局响应拦截器，统一处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const response = error.response;
    if (response) {
      // 处理错误响应
      if (response.status === 401) {
        // 未授权，清除 token
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
      } else if (response.status === 403) {
        // 禁止访问
        console.error('权限不足:', response.data.message);
      } else {
        return Promise.reject(response.data.message || ' 请求失败');
      }
    } else {
      // 网络错误或其他错误
      console.error('网络错误:', error.message);
    }

    return Promise.reject(error);
  }
);

//请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
