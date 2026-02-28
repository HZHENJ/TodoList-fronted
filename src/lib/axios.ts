import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { message } from 'antd';
import { ErrorCode } from '../utils/errorCodes';

// 1. 创建 Axios 实例
const request: AxiosInstance = axios.create({
  // 本地 npm run dev 时，它会读 localhost；执行 npm run build 时，它会自动打入线上域名
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 10000, 
});

// 2. 请求拦截器 (前置中间件)
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器 (后置中间件)
request.interceptors.response.use(
  // --------------------------------------------------
  // A. 处理 HTTP 状态码为 2xx 的情况 (业务逻辑都在这里)
  // --------------------------------------------------
  (response: AxiosResponse) => {
    const res = response.data;

    // 1. 业务逻辑成功 (200)
    if (res.code === ErrorCode.SUCCESS) {
      return res; 
    }

    // 2. 拦截 Token 失效的情况 (10001, 10002)
    if (
      res.code === ErrorCode.ERROR_AUTH_CHECK_TOKEN_FAIL ||
      res.code === ErrorCode.ERROR_AUTH_CHECK_TOKEN_TIMEOUT
    ) {
      message.error(res.msg || '登录状态已失效，请重新登录');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error(res.msg));
    }

    // 3. 拦截其他所有业务错误 (如 20003 密码错误，30001 任务不存在)
    // 直接把后端 MsgFlags 里的提示语给用户！
    message.error(res.msg || '操作失败');
    return Promise.reject(new Error(res.msg || 'Error'));
  },

  // --------------------------------------------------
  // B. 处理 HTTP 协议层面的报错 (如 400, 401, 404, 500)
  // --------------------------------------------------
  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401: // 有些框架在 token 无效时依然会抛 HTTP 401，这里留着做双保险
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login'; 
          break;
        case 403:
          message.error('您没有权限访问该资源');
          break;
        case 404:
          message.error('请求的接口地址不存在 (404)');
          break;
        case 500:
          message.error('服务器内部错误，请检查 Go 后端日志 (500)');
          break;
        default:
          message.error(data?.message || '网络请求发生未知错误');
      }
    } else if (error.request) {
      // 没收到响应：大概率是 Go 服务没启动，或者跨域 (CORS) 没配置
      message.error('无法连接到服务器，请检查 Go 后端是否运行，或 CORS 配置');
    } else {
      message.error(`请求错误: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default request;