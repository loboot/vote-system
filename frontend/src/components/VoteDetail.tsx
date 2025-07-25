import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaUsers, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';

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

const VoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // 获取投票详情
  const fetchVote = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/vote/${id}`);
      const data = await response.json();
      
      if (data.code === 200) {
        setVote(data.data);
      } else {
        setError(data.message || '获取投票详情失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取投票详情失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    
    const fetchVoteData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/vote/${id}`);
        const data = await response.json();
        
        if (data.code === 200) {
          setVote(data.data);
        } else {
          setError(data.message || '获取投票详情失败');
        }
      } catch (err) {
        setError('网络错误，请稍后重试');
        console.error('获取投票详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteData();
  }, [id]);

  // 处理选项选择
  const handleOptionChange = (optionId: number) => {
    if (!vote) return;

    if (vote.multi) {
      // 多选模式
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // 单选模式
      setSelectedOptions([optionId]);
    }
  };

  // 提交投票
  const handleSubmitVote = async () => {
    if (!vote || selectedOptions.length === 0) return;

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:8080/api/vote/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_id: vote.id,
          option_ids: selectedOptions,
        }),
      });

      const data = await response.json();
      
      if (data.code === 200) {
        setHasVoted(true);
        // 重新获取投票数据以更新计数
        await fetchVote();
        alert('投票成功！');
      } else {
        alert(data.message || '投票失败');
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
      console.error('提交投票失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

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

  // 计算选项百分比
  const getOptionPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
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

  if (error || !vote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-6">{error || '投票不存在'}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回首页
            </button>
            <button
              onClick={fetchVote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = getTotalVotes(vote.options);
  const expired = isExpired(vote.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{vote.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaUsers className="w-4 h-4 mr-1" />
                  {totalVotes} 票
                </div>
                <div className="flex items-center">
                  <FaClock className="w-4 h-4 mr-1" />
                  {formatDate(vote.deadline)}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  vote.multi 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {vote.multi ? '多选' : '单选'}
                </span>
                {expired ? (
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
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* 编辑投票 */}}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="编辑投票"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* 删除投票 */}}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除投票"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {/* 投票说明 */}
            {!hasVoted && !expired && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  {vote.multi ? '您可以选择多个选项' : '请选择一个选项'}，然后点击提交投票。
                </p>
              </div>
            )}

            {hasVoted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  ✓ 您已成功投票！感谢参与。
                </p>
              </div>
            )}

            {expired && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  此投票已结束，无法继续投票。
                </p>
              </div>
            )}

            {/* 投票选项 */}
            <div className="space-y-4">
              {vote.options.map((option) => {
                const percentage = getOptionPercentage(option.count, totalVotes);
                const isSelected = selectedOptions.includes(option.id);

                return (
                  <div
                    key={option.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${expired || hasVoted ? 'cursor-not-allowed opacity-75' : ''}`}
                    onClick={() => !expired && !hasVoted && handleOptionChange(option.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type={vote.multi ? 'checkbox' : 'radio'}
                          checked={isSelected}
                          onChange={() => !expired && !hasVoted && handleOptionChange(option.id)}
                          disabled={expired || hasVoted}
                          className="mr-3"
                        />
                        <span className="text-gray-900 font-medium">{option.content}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.count} 票 ({percentage}%)
                      </div>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 提交按钮 */}
            {!hasVoted && !expired && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSubmitVote}
                  disabled={selectedOptions.length === 0 || submitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    selectedOptions.length === 0 || submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? '提交中...' : '提交投票'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteDetail;
