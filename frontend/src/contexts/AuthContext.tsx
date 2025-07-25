import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 用户信息类型
export interface User {
  id: number;
  username: string;
  email: string;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string,  password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 这里可以验证token的有效性
      // 暂时简化处理，实际项目中应该向后端验证token
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.code === 200) {
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('token', userData.token || 'dummy-token');
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        console.error('登录失败:', data.message);
        return false;
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      return false;
    }
  };

  // 注册函数
  const register = async (username: string,  password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username,  password }),
      });

      const data = await response.json();

      if (data.code === 200) {
        // 注册成功后自动登录
        return await login(username, password);
      } else {
        console.error('注册失败:', data.message);
        return false;
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      return false;
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用认证上下文的hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
