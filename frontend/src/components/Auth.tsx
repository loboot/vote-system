import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import useAuthStore from '@/store/AuthContext';
import { login as loginApi, register as registerApi } from '@/services/auth';
import { useNavigate } from 'react-router';

interface IFormInput {
  username: string;
  password: string;
  confirmPassword?: string; // Added for registration
}
export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm<IFormInput>();
  const [isLogin, setIsLogin] = useState(true);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const onSubmit = async (data: IFormInput) => {
    try {
      if (!isLogin) {
        // 注册时校验两次密码
        if (data.password !== data.confirmPassword) {
          setError('password', { message: '两次密码不一致' });
          setError('confirmPassword', { message: '两次密码不一致' });
          return;
        }
        // 注册
        await registerApi({
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword!,
        });
        reset();
        setIsLogin(true);
      } else {
        // 登录
        const res = await loginApi({
          username: data.username,
          password: data.password,
        });

        /// token
        setAuth(res.data.user, 'token');

        navigate('/');
      }
    } catch (err: unknown) {
      console.error(err);

      const msg = '认证失败';

      setError('username', { message: msg });
    }
  };
  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white px-6 py-8 rounded-xl border border-gray-200 min-w-[320px] w-full max-w-[400px] mx-auto shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2 tracking-wide">
            {isLogin ? '登录' : '注册'}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-10 text-gray-400">
              <FaUserAlt size={16} />
            </span>
            <input
              {...register('username', { required: '用户名不能为空' })}
              name="username"
              type="text"
              autoComplete="username"
              placeholder="用户名"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.username ? 'border-red-400' : 'border-gray-200'
              } rounded-md outline-none text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-gray-50`}
              onFocus={() => clearErrors('username')}
            />
            <div className="h-5 text-xs text-red-500 mt-1">{errors.username?.message}</div>
          </div>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-10 text-gray-400">
              <FaLock size={16} />
            </span>
            <input
              {...register('password', { required: '密码不能为空' })}
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="密码"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.password ? 'border-red-400' : 'border-gray-200'
              } rounded-md outline-none text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-gray-50`}
            />
            <div className="h-5 text-xs text-red-500 mt-1">{errors.password?.message}</div>
          </div>
          {!isLogin && (
            <div className="mb-6 relative">
              <span className="absolute left-3 top-10 text-gray-400">
                <FaLock size={16} />
              </span>
              <input
                {...register('confirmPassword', {
                  required: '请再次输入密码',
                  validate: (value) => value === password || '两次密码不一致',
                })}
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="确认密码"
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                } rounded-md outline-none text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-gray-50`}
              />
              <div className="h-5 text-xs text-red-500 mt-1">{errors.confirmPassword?.message}</div>
            </div>
          )}
          <input
            type="submit"
            value={isSubmitting ? (isLogin ? '登录中...' : '注册中...') : isLogin ? '登录' : '注册'}
            disabled={isSubmitting}
            className={`w-full py-2 bg-gray-800 hover:bg-gray-900 text-white border-none rounded-md font-semibold text-base cursor-pointer transition-all duration-150 mb-2 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          />
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 underline underline-offset-2 text-sm font-medium transition-colors duration-150"
            onClick={() => [clearErrors(), setIsLogin((prev) => !prev)]}>
            {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
