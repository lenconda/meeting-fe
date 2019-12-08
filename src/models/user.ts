import { Effect } from 'dva';
import { Reducer } from 'redux';

import { profile } from '@/services/user';

export interface IUserModelState {
  name?: string;
  account?: string;
  role?: number;
  id?: number;
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
    role: -1,
    id: -1,
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
      const { name, account, role, id } = payload;
      return {
        ...state,
        name,
        account,
        role,
        id,
      };
    },
  },
};

export default UserModel;
