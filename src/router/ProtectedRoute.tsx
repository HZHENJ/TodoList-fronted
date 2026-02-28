// src/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  // 简单的权限校验：判断本地有没有 token
  const token = localStorage.getItem('token');

  if (!token) {
    // 如果没有登录，重定向到登录页，并替换当前历史记录
    return <Navigate to="/login" replace />;
  }

  // 如果已登录，渲染子路由内容 (相当于 Go 里的 c.Next())
  return <Outlet />;
};