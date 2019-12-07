import { Effect } from 'dva';
import { Reducer } from 'redux';

import { profile } from '@/services/user';

export interface IUserModelState {
  name?: string;
  account?: string;
}

export interface IUserModelType {
  namespace: 'user';
  state: IUserModelState;
  effects: {
    fetchUserProfile: Effect;
  };
  reducers: {
    setUserProfile: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModelType = {
  namespace: 'user',

  state: {
    name: '',
    account: '',
  },

  effects: {
    *fetchUserProfile(_, { call, put }) {
      const response = yield call(profile);
      yield put({
        type: 'setUserProfile',
        payload: response.data.data,
      });
    },
  },

  reducers: {
    setUserProfile(state, { payload }) {
      const { name, account } = payload;
      return {
        ...state,
        name,
        account,
      };
    },
  },
};

export default UserModel;
