import request from '@/utils/request';

export interface RegisterParamsType {
  account: string;
  password: string;
  name: string;
}

export async function register(params: RegisterParamsType) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  return request.post('/api/auth/signup', params);
}
