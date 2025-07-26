export interface VoteOption {
  id: number;
  vote_id: number;
  content: string;
  count: number;
  user_votes?: UserVote[];
}

export interface UserVote {
  id: number;
  user_id: number;
  vote_id: number;
  option_id: number;
  created_at: string;
}

export interface Vote {
  id: number;
  title: string;
  multi: boolean;
  deadline: number;
  creator_id: number;
  created_at: string;
  updated_at: string;
  options: VoteOption[];
  user_votes?: UserVote[];
}

// 创建投票请求
export interface CreateVoteRequest {
  title: string;
  options: string[];
  multi: boolean;
  deadline: number;
}

// 更新投票请求
export interface UpdateVoteRequest {
  id: number;
  title: string;
  options: string[];
  multi: boolean;
  deadline: number;
}

// 投票请求
export interface VoteRequest {
  vote_id: number;
  option_ids: number[];
}

// 投票响应
export interface VoteResponse {
  vote: Vote;
  hasVoted: boolean;
  userVotes?: number[]; // 用户已选择的选项ID列表
}
