import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { IGlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { IUserModelState } from './user';
import { ILoginModelType } from './login';
import { IRegisterModelType } from './register';
import { IMeetingModelType } from './meeting';

export {
  IGlobalModelState,
  SettingModelState,
  IUserModelState,
  IRegisterModelType,
  IMeetingModelType,
};

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    register?: boolean;
    meeting?: boolean;
  };
}

export interface ConnectState {
  global: IGlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: IUserModelState;
  login: ILoginModelType;
  register: IRegisterModelType;
  meeting: IMeetingModelType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
