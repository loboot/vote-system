import type { Vote, CreateVoteRequest, UpdateVoteRequest, VoteRequest } from '@/types/vote';
import type { Response } from '@/types/api';
import api from './api';

const BASE_URL = '/vote';

/**
 * 创建投票
 * @param data 创建投票数据
 * @returns Promise<Vote>
 */
export const createVote = async (data: CreateVoteRequest): Promise<Response<Vote>> =>
  api.post(`${BASE_URL}/create`, data);

/**
 * 获取投票详情
 * @param id 投票ID
 * @returns Promise<VoteResponse>
 */
export const getVote = async (id: string | number): Promise<Response<Vote>> => api.get(`${BASE_URL}/${id}`);

/**
 * 更新投票
 * @param data 更新投票数据
 * @returns Promise<Vote>
 */
export const updateVote = async (data: UpdateVoteRequest): Promise<Vote> => api.put(`${BASE_URL}/update`, data);

/**
 * 删除投票
 * @param id 投票ID
 * @returns Promise<void>
 */
export const deleteVote = (id: string | number) => api.delete(`${BASE_URL}/${id}`);

/**
 * 投票
 * @param data 投票数据
 */
export const submitVote = (data: VoteRequest): Promise<Response<void>> => api.post(`${BASE_URL}/submit`, data);

/**
 * 获取用户的投票列表
 */
export const getUserVotes = () => api.get(`${BASE_URL}/my`);

/**
 * 获取所有投票列表
 */
export const getAllVotes = (): Promise<Response<Vote[]>> => api.get(`${BASE_URL}/all`);
