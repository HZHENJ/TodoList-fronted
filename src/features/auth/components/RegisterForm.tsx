import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { registerAPI } from '../api';
import type { AuthRequest } from '../types';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 剥离掉确认密码字段，只把 email 和 password 发给后端
      const payload: AuthRequest = { email: values.email, password: values.password };
      await registerAPI(payload);
      
      message.success('注册成功！请登录。');
      navigate('/login'); 
    } catch (error) {
      console.error('Register failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="注册新账号" style={{ maxWidth: 400, margin: '100px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Form name="register" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址！' },
            { type: 'email', message: '邮箱格式不正确！' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="输入有效邮箱" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码！' },
            { min: 6, max: 20, message: '密码长度需在6-20位之间！' }
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="设置密码" />
        </Form.Item>

        {/* 仅限前端的二次确认校验 */}
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '请确认你的密码！' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不匹配！'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注 册
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};