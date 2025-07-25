import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';

interface CreateVoteForm {
  title: string;
  options: string[];
  multi: boolean;
  deadline: string;
}

const CreateVote: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateVoteForm>({
    title: '',
    options: ['', ''],
    multi: false,
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // 添加选项
  const addOption = () => {
    if (form.options.length < 10) {
      setForm(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  // 删除选项
  const removeOption = (index: number) => {
    if (form.options.length > 2) {
      setForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  // 更新选项内容
  const updateOption = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证标题
    if (!form.title.trim()) {
      newErrors.title = '请输入投票标题';
    } else if (form.title.trim().length < 5) {
      newErrors.title = '投票标题至少需要5个字符';
    } else if (form.title.trim().length > 100) {
      newErrors.title = '投票标题不能超过100个字符';
    }

    // 验证选项
    const validOptions = form.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = '至少需要2个有效选项';
    } else if (validOptions.length !== new Set(validOptions).size) {
      newErrors.options = '选项不能重复';
    }

    // 验证截止时间
    if (form.deadline) {
      const deadlineDate = new Date(form.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        newErrors.deadline = '截止时间必须晚于当前时间';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // 过滤空选项
      const validOptions = form.options.filter(opt => opt.trim());
      
      // 转换截止时间为时间戳
      const deadline = form.deadline ? Math.floor(new Date(form.deadline).getTime() / 1000) : 0;

      const response = await fetch('http://localhost:8080/api/vote/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title.trim(),
          options: validOptions,
          multi: form.multi,
          deadline: deadline,
        }),
      });

      const data = await response.json();
      
      if (data.code === 200) {
        alert('投票创建成功！');
        navigate('/');
      } else {
        alert(data.message || '创建投票失败');
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
      console.error('创建投票失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 获取当前时间的输入格式
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">创建投票</h1>
              <p className="text-gray-600 mt-1">创建一个新的投票来收集大家的意见</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* 投票标题 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                投票标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="请输入投票标题..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {form.title.length}/100 字符
              </p>
            </div>

            {/* 投票类型 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                投票类型
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!form.multi}
                    onChange={() => setForm(prev => ({ ...prev, multi: false }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700">单选投票</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={form.multi}
                    onChange={() => setForm(prev => ({ ...prev, multi: true }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700">多选投票</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {form.multi ? '用户可以选择多个选项' : '用户只能选择一个选项'}
              </p>
            </div>

            {/* 投票选项 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                投票选项 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {form.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`选项 ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        maxLength={50}
                      />
                    </div>
                    {form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除选项"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {form.options.length < 10 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  添加选项
                </button>
              )}
              
              {errors.options && (
                <p className="mt-2 text-sm text-red-600">{errors.options}</p>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                最多可添加10个选项，每个选项最多50个字符
              </p>
            </div>

            {/* 截止时间 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                截止时间 (可选)
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                  min={getCurrentDateTime()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.deadline ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                如果不设置截止时间，投票将一直开放
              </p>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting ? '创建中...' : '创建投票'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVote;
