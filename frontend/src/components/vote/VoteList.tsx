import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClock, FaCheckCircle } from 'react-icons/fa';
import { getAllVotes } from '@/services/vote';

interface Vote {
  id: number;
  title: string;
  multi: boolean;
  deadline: number;
  creator_id: number;
  created_at: string;
  options: VoteOption[];
}

interface VoteOption {
  id: number;
  vote_id: number;
  content: string;
  count: number;
}

const VoteList: React.FC = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // 获取所有投票
  const fetchVotes = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await getAllVotes();

      if (res.code === 200) {
        setVotes(res.data || []);
      } else {
        setError(res.message || '获取投票失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取投票失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();

    // 每秒更新一次时间，用于实时倒计时
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 倒计时显示
  const getCountdown = (deadline: number) => {
    if (!deadline) return '无截止时间';

    const now = currentTime / 1000; // 转换为秒
    const timeLeft = deadline - now;

    if (timeLeft <= 0) {
      return '已截止';
    }

    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = Math.floor(timeLeft % 60);

    if (days > 0) {
      return `剩余 ${days}天 ${hours}时 ${minutes}分`;
    } else if (hours > 0) {
      return `剩余 ${hours}时 ${minutes}分 ${seconds}秒`;
    } else if (minutes > 0) {
      return `剩余 ${minutes}分 ${seconds}秒`;
    } else if (seconds > 0) {
      return `剩余 ${seconds}秒`;
    } else {
      return '即将截止';
    }
  };

  // 检查是否即将过期（1小时内）
  const isUrgent = (deadline: number) => {
    if (!deadline) return false;
    const timeLeft = deadline - currentTime / 1000;
    return timeLeft > 0 && timeLeft <= 60 * 60; // 1小时内
  };

  // 检查是否已过期
  const isExpired = (deadline: number) => {
    if (!deadline) return false;
    return Date.now() / 1000 > deadline;
  };

  // 计算总票数
  const getTotalVotes = (options: VoteOption[]) => {
    return options.reduce((total, option) => total + option.count, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto absolute top-0"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">加载中...</p>
          <p className="mt-2 text-sm text-gray-500">正在获取投票数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">投票中心</h1>
          <p className="text-gray-600">参与投票，表达你的观点</p>
        </div>
        {/* 顶部操作栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchVotes}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
              🔄 刷新
            </button>
            <div className="hidden sm:block text-sm text-gray-500">共 {votes.length} 个投票</div>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <FaPlus className="w-4 h-4 mr-2" />
            创建投票
          </button>
        </div>
        {error && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button
                    onClick={fetchVotes}
                    className="mt-2 text-red-600 hover:text-red-800 underline font-medium transition-colors">
                    点击重试
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}{' '}
        {votes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🗳️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">暂无投票</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              还没有创建任何投票，快来创建第一个投票，让大家参与进来吧！
            </p>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-medium">
              <FaPlus className="w-5 h-5 mr-3" />
              创建第一个投票
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {votes.map((vote) => (
              <div
                key={vote.id}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
                onClick={() => navigate(`/vote/${vote.id}`)}>
                {/* 卡片头部装饰 */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <div className="p-6">
                  {/* 投票标题 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {vote.title}
                  </h3>

                  {/* 投票类型和状态 */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        vote.multi
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
                          : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                      }`}>
                      {vote.multi ? '📋 多选' : '🔘 单选'}
                    </span>

                    {isExpired(vote.deadline) ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border border-red-200">
                        <FaClock className="w-3 h-3 mr-1.5" />
                        已结束
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                        <FaCheckCircle className="w-3 h-3 mr-1.5" />
                        进行中
                      </span>
                    )}
                  </div>

                  {/* 投票统计 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="inline-flex items-center">👥 {getTotalVotes(vote.options)} 人参与</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isExpired(vote.deadline)
                          ? 'text-red-600'
                          : isUrgent(vote.deadline)
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`}>
                      {getCountdown(vote.deadline)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteList;
