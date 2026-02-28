import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginAPI } from '../api';
import type { AuthRequest } from '../types';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: AuthRequest) => {
    setLoading(true);
    try {
      const res = await loginAPI(values);
      const { token, user } = res.data;
      
      // 登录成功：保存 Token 并给提示
      localStorage.setItem('token', token);
      message.success(`欢迎回来，${user.nickname || user.username || user.email}!`);
      
      navigate('/dashboard');
      
    } catch (error: any) {
      // 错误提示由底层的 axios 拦截器统一处理，这里也可以做特定的错误捕获
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="账号登录" style={{ maxWidth: 400, margin: '100px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Form name="login" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址！' },
            { type: 'email', message: '邮箱格式不正确！' } // 对齐后端的 email binding
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="邮箱地址" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码！' },
            { min: 6, max: 20, message: '密码长度需在6-20位之间！' } // 对齐后端的 min=6,max=20
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登 录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};