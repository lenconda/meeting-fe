import { Effect } from 'dva';

import { createMeeting } from '@/services/meeting';

export interface IMeetingModelType {
  namespace: string;
  state: {};
  effects: {
    createMeeting: Effect;
  };
}

const Model: IMeetingModelType = {
  namespace: 'meeting',

  state: {},

  effects: {
    *createMeeting({ payload }, { call }) {
      yield call(createMeeting, payload);
    },
  },
};

export default Model;
