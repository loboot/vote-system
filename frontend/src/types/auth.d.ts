export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type RegisterCredentials = LoginCredentials;

export type UserProfile = Pick<User, 'id' | 'username'>;
