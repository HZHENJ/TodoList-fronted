// src/features/auth/api.ts
import request from '../../lib/axios'; 
import type { AuthRequest, LoginResponse } from './types';

export const registerAPI = (data: AuthRequest) => {
  return request.post('/api/v1/user/register', data);
};

export const loginAPI = (data: AuthRequest) => {
  // 注意：这里的泛型取决于你 axios 拦截器最终 return 的数据层级
  return request.post<any, { data: LoginResponse }>('/api/v1/user/login', data);
};

export const logoutAPI = () => {
  // 退出登录需要鉴权 (5 handlers)，我们的 axios 拦截器会自动带上 Token
  return request.post('/api/v1/user/logout');
};