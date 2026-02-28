// 对应后端的 UserRegisterRequest 和 UserLoginRequest
export interface AuthRequest {
  email: string;
  password: string;
}

// 对应后端的 UserInfo
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
}

// 对应后端的 UserLoginResponse
export interface LoginResponse {
  token: string;
  user: UserInfo;
}