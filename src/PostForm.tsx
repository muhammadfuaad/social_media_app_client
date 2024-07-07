import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';

type FieldType = {
  content?: string;
};

const PostForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation()
  // console.log(location);
  if (location.state !== null) {
    const content = location?.state.content
    const id = location?.state._id
  }
  // question: why doesn't this work for true condition?
  
  const token = localStorage.getItem("token");

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    
    if (location?.pathname == "/new_post") {
        axios.post('http://127.0.0.1:3000/new_post', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }})
          .then(response => {
            console.log('response:', response);
            console.log('response.data:', response.data);

            notification.success({
              message: response.data.message,
            });
            navigate("/profile");
          })
          .catch(error => {
            console.error('error', error);

            notification.error({
              message: 'Login Failed',
              description: 'Please check your credentials and try again.',
            });
          });
      } else {
        axios.put(`http://127.0.0.1:3000/update_post/${location.state._id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`
          }})
          .then(response => {
            console.log('response:', response);
            console.log('response.data:', response.data);

            notification.success({
              message: response.data.message,
            });
            navigate("/profile");
          })
          .catch(error => {
            console.error('error', error);

            notification.error({
              message: 'Login Failed',
              description: 'Please check your credentials and try again.',
            });
          });
      };
  }
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='bg-gray-100 p-12 rounded-xl'>
      <h2 className='font-bold text-2xl mb-16'>Add New Post</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={location.state !== null ? { content: location.state.content, remember: true } : {remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Add Your Content Here"
          name="content"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PostForm;