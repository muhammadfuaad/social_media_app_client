import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Corrected import

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values:", values);
    
    axios.post('http://127.0.0.1:3000/register', values)
      .then(response => {
        console.log('response.data:', response.data);
        navigate("/login")
        notification.success({
          message: response.data.message,
          description: `Welcome, ${values.name}!`,
        });
      })
      .catch(error => {
        console.error('error', error);
        const response = error.response
        console.error('error.response', error.response);
        console.error('error.response.data.message:', error.response.data.message);
        console.error('error.request', error.request);
        console.error('response', response);
        notification.error({
          message: 'Registration Failed',
          description: error.response.data.message,
        });
      }) 
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='bg-gray-100 p-12 rounded-xl'>
      <h2 className='font-bold text-2xl mb-16'>Register</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <span className="text-sm text-black">Already registered <a className='cursor-pointer' onClick={()=>navigate("/login")}>Login</a></span>
    </div>
  );
};

export default Register;
