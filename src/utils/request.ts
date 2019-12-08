import axios from 'axios';
import { message } from 'antd';
import router from 'umi/router';

const toLogin = (msg: string) => {
  router.push('/user/login');
  message.error(msg);
};

axios.defaults.timeout = 3600000;

axios.interceptors.request.use(config => {
  const newConfig = config;
  if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
    newConfig.headers = {
      Authorization:
          `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
    };
  }
  return newConfig;
});

axios.interceptors.response.use((response: any) => {
  if (response.data.data && response.data.data.token) {
    if (window.localStorage.getItem('persist') === '1') {
      window.localStorage.setItem('token', response.data.data.token);
    } else {
      window.sessionStorage.setItem('token', response.data.data.token);
    }
  }

  if (response.data.message && response.data.message !== 'OK') {
    message.success(response.data.message);
  }

  return response;
}, error => {
  if (error.response) {
    switch (error.response.status) {
      // unauthorized
      case 401:
        toLogin('请先登录');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      default:
        message.error(error.response.data.message);
    }
  }
});

export default axios;
