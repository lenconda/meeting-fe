import { Effect } from 'dva';
import { Reducer } from 'redux';

import {
  createMeeting,
  getAllMeetings,
  getCreatedMeetings,
  getJoinedMeetings,
  attendMeeting,
  getCurrentMeetingDetail,
} from '@/services/meeting';

export interface IMeetingListItem {
  id: string;
  meetingName: string;
  meetingLocation: string;
  startTime: string;
  endTime: string;
  initiatorId: number;
}

export interface ICurrentMeetingState {
  id: string;
  meetingName: string;
  meetingLocation: string;
  startTime: string;
  endTime: string;
  hotel: string;
  initiatorId: number;
  idCardNumber: boolean;
  name: boolean;
  workspace: boolean;
  telephone: boolean;
  gender: boolean;
  room: boolean;
}

export interface IMeetingState {
  meetings?: IMeetingListItem[];
  total?: number;
  currentMeeting?: {
    [T in keyof ICurrentMeetingState]: ICurrentMeetingState[T];
  };
  joinModalVisible?: boolean;
}

export interface IMeetingModelType {
  namespace: string;
  state: IMeetingState;
  effects: {
    createMeeting: Effect;
    getAllMeetings: Effect;
    getCreatedMeetings: Effect;
    getJoinedMeetings: Effect;
    getCurrentMeeting: Effect;
    getJoinModalVisible: Effect;
  };
  reducers: {
    setMeetings: Reducer<IMeetingState>;
    setCurrentMeeting: Reducer<IMeetingState>;
    setJoinModalVisible: Reducer<IMeetingState>;
  };
}

const defaultCurrentMeetingState: ICurrentMeetingState = {
  id: '',
  meetingName: '',
  meetingLocation: '',
  startTime: '',
  endTime: '',
  hotel: '',
  initiatorId: -1,
  idCardNumber: false,
  name: false,
  workspace: false,
  telephone: false,
  gender: false,
  room: false,
};

const Model: IMeetingModelType = {
  namespace: 'meeting',

  state: {
    meetings: [],
    total: 0,
    currentMeeting: defaultCurrentMeetingState,
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

    *getCurrentMeeting({ payload }, { call, put }) {
      const response = yield call(getCurrentMeetingDetail, payload);

      if (response.data.data) {
        yield put({
          type: 'setCurrentMeeting',
          payload: response.data.data,
        });
      }
    },

    *getJoinModalVisible({ payload }, { put }) {
      yield put({
        type: 'setJoinModalVisible',
        payload,
      });
    },
  },

  reducers: {
    setMeetings(state, { payload }): IMeetingState {
      return {
        ...state,
        meetings: payload.items,
        total: payload.total,
      };
    },

    setCurrentMeeting(state, { payload }) {
      return {
        ...state,
        currentMeeting: payload,
      };
    },

    setJoinModalVisible(state, { payload }) {
      return {
        ...state,
        joinModalVisible: payload,
      };
    },
  },
};

export default Model;
