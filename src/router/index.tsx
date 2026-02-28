import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Dashboard } from '../features/tasks/components/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    // 根路径默认重定向到控制台
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/register',
    element: <RegisterForm />,
  },
  {
    // 需要登录才能访问的路由组
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // 未来如果你有 /profile 或者 /settings，都可以继续加在这个 children 里
    ],
  },
  {
    // 捕获所有未定义的路由 (404)
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);