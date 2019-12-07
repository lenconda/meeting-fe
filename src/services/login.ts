import request from '@/utils/request';

export interface LoginParamsType {
  account: string;
  password: string;
  name: string;
}

export async function login(params: LoginParamsType) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  return request.post('/api/auth/signin', params);
}
