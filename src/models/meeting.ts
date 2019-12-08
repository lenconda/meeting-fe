import { Effect } from 'dva';
import { Reducer } from 'redux';

import {
  createMeeting,
  getAllMeetings,
} from '@/services/meeting';

export interface IMeetingListItem {
  id: string;
  meetingName: string;
  meetingLocation: string;
  startTime: string;
  endTime: string;
  initiatorId: number;
}

export interface IMeetingState {
  meetings: IMeetingListItem[];
  total: number;
}

export interface IMeetingModelType {
  namespace: string;
  state: IMeetingState;
  effects: {
    createMeeting: Effect;
    getAllMeetings: Effect;
  };
  reducers: {
    setAllMeetings: Reducer<IMeetingState>;
  };
}

const Model: IMeetingModelType = {
  namespace: 'meeting',

  state: {
    meetings: [],
    total: 0,
  },

  effects: {
    *createMeeting({ payload }, { call }) {
      yield call(createMeeting, payload);
    },

    *getAllMeetings({ payload }, { call, put }) {
      const response = yield call(getAllMeetings, payload);
      if (response.data.data) {
        yield put({
          type: 'setAllMeetings',
          payload: response.data.data,
        });
      }
    },
  },

  reducers: {
    setAllMeetings(state, { payload }) {
      return {
        ...state,
        meetings: payload.items,
        total: payload.total,
      };
    },
  },
};

export default Model;
