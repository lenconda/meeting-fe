import router from 'umi/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { login } from '@/services/login';
import { getPageQuery } from '@/utils/utils';

export interface ILoginModelType {
  namespace: string;
  state: {};
  effects: {
    login: Effect;
    logout: Effect;
  };
}

const Model: ILoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call }) {
      window.localStorage.setItem('persist', payload.remember ? '1' : '0');

      const response = yield call(login, payload);
      // Login successfully
      if (response.data.message === 'OK') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield router.push(redirect || '/meetings');
      }
    },

    *logout() {
      const { redirect } = getPageQuery();
      window.localStorage.removeItem('token');
      window.sessionStorage.removeItem('token');
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield router.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
};

export default Model;
