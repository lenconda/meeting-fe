import { Reducer } from 'redux';
import { Subscription } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';

export interface INoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface IGlobalModelState {
  collapsed?: boolean;
  name?: string;
  account?: string;
}

export interface IGlobalModelType {
  namespace: 'global';
  state: IGlobalModelState;
  effects: {
  };
  reducers: {
    changeLayoutCollapsed: Reducer<IGlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: IGlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    name: '',
  },

  effects: {
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
