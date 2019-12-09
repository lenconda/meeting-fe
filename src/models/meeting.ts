import { Effect } from 'dva';
import { Reducer } from 'redux';

import {
  createMeeting,
  getAllMeetings,
  getCreatedMeetings,
  getJoinedMeetings,
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
    getCreatedMeetings: Effect;
    getJoinedMeetings: Effect;
  };
  reducers: {
    setMeetings: Reducer<IMeetingState>;
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
          type: 'setMeetings',
          payload: response.data.data,
        });
      }
    },

    *getCreatedMeetings({ payload }, { call, put }) {
      const response = yield call(getCreatedMeetings, payload);
      if (response.data.data) {
        yield put({
          type: 'setMeetings',
          payload: response.data.data,
        });
      }
    },

    *getJoinedMeetings({ payload }, { call, put }) {
      const response = yield call(getJoinedMeetings, payload);
      if (response.data.data) {
        yield put({
          type: 'setMeetings',
          payload: response.data.data,
        });
      }
    },
  },

  reducers: {
    setMeetings(state, { payload }) {
      return {
        ...state,
        meetings: payload.items,
        total: payload.total,
      };
    },
  },
};

export default Model;
