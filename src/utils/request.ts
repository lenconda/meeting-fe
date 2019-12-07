import axios from 'axios';
import { message } from 'antd';
import router from 'umi/router';

// create axios instance
const api = axios.create({
  timeout: 3000,
});

const toLogin = (msg: string) => {
  router.push('/user/login');
  message.warning(msg);
};

const removeTokenInLocalStorage = (): Promise<void> => {
  window.localStorage.removeItem('token');
  return Promise.resolve();
};

// Interceptors Here

// request interceptor
api.interceptors.request.use(
  config => {
    // const newConfig = config;
    // add token to req headers
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  error => Promise.reject(error),
);

// response interceptor
axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response.data.message !== 'OK') {
      message.success(response.data.message);
    }

    if (response.data.data.token) {
      window.localStorage.setItem('token', response.data.data.token);
    }

    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      switch (error.response.status) {
        // unauthorized
        case 401:
          toLogin('请先登录');
          break;
        case 403:
          removeTokenInLocalStorage().then(() => {
            toLogin('登录过期 请重新登录');
          });
          break;
        case 404:
          message.warning('请求的资源不存在');
          break;
        default:
          message.warning(error.response.data.message);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
