import axios from 'axios';
import { Message } from 'element-ui';
import config from '@/config';

const service = axios.create({
  baseURL: config.apiUrl, // 使用配置文件中的 API 地址
  timeout: 10000,
  withCredentials: true
});

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service; 