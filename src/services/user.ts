import request from '@/utils/request';

export async function profile(): Promise<any> {
  return request('/api/auth/profile');
}
