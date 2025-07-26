import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClock, FaUsers, FaCheckCircle } from 'react-icons/fa';
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
  }, []);

  // 格式化日期
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '无截止时间';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchVotes}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            刷新
          </button>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus className="w-4 h-4 mr-2" />
          创建投票
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button onClick={fetchVotes} className="mt-2 text-red-600 hover:text-red-800 underline">
            重试
          </button>
        </div>
      )}

      {votes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗳️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无投票</h3>
          <p className="text-gray-600 mb-6">还没有创建任何投票，快来创建第一个投票吧！</p>
          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="w-4 h-4 mr-2" />
            创建投票
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {votes.map((vote) => (
            <div
              key={vote.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/vote/${vote.id}`)}>
              <div className="p-6">
                {/* 投票标题 */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{vote.title}</h3>

                {/* 投票类型和状态 */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vote.multi ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {vote.multi ? '多选' : '单选'}
                  </span>

                  {isExpired(vote.deadline) ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <FaClock className="w-3 h-3 mr-1" />
                      已结束
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="w-3 h-3 mr-1" />
                      进行中
                    </span>
                  )}
                </div>

                {/* 选项预览 */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">选项 ({vote.options.length}个)</div>
                  <div className="space-y-1">
                    {vote.options.slice(0, 3).map((option) => (
                      <div key={option.id} className="text-sm text-gray-700 truncate">
                        • {option.content}
                      </div>
                    ))}
                    {vote.options.length > 3 && (
                      <div className="text-sm text-gray-500">... 还有 {vote.options.length - 3} 个选项</div>
                    )}
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <FaUsers className="w-4 h-4 mr-1" />
                    {getTotalVotes(vote.options)} 票
                  </div>
                  <div className="flex items-center">
                    <FaClock className="w-4 h-4 mr-1" />
                    {formatDate(vote.deadline)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoteList;
