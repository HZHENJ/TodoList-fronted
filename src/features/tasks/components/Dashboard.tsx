// src/features/tasks/components/Dashboard.tsx
import React from 'react';
import { Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <Card 
        title="To-Do List 控制台" 
        extra={<Button type="primary" danger onClick={handleLogout}>退出登录</Button>}
      >
        <h2>欢迎来到任务管理中心！</h2>
        <p>这里稍后将展示你的任务列表...</p>
      </Card>
    </div>
  );
};