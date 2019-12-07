import router from 'umi/router';
import { Effect } from 'dva';

import { register } from '@/services/register';

export interface IRegisterModelType {
  namespace: string;
  state: {};
  effects: {
    register: Effect;
  };
}

const Model: IRegisterModelType = {
  namespace: 'register',

  state: {},

  effects: {
    *register({ payload }, { call }) {
      const response = yield call(register, payload);

      if (response.status === 200) {
        router.push('/meetings');
      }
    },
  },
};

export default Model;
