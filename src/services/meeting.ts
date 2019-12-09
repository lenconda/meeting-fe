import request from '@/utils/request';

interface ICreateMeeting {
  meetingName: string;
  meetingLocation: string;
  hotel: string;
  startTime: string;
  endTime: string;
  name: boolean;
  idCardNumber: boolean;
  workspace: boolean;
  telephone: boolean;
  gender: boolean;
  room: boolean;
}

export async function createMeeting(params: ICreateMeeting) {
  return request.post('/api/meeting/create', params);
}

export async function getAllMeetings(page: string = '1') {
  return request.get(`/api/meeting/list/all?page=${page}`);
}

export async function getCreatedMeetings(page: string = '1') {
  return request.get(`/api/meeting/list/created?page=${page}`);
}

export async function getJoinedMeetings(page: string = '1') {
  return request.get(`/api/meeting/list/joined?page=${page}`);
}

export async function attendMeeting(params: any) {
  return request.post('/api/meeting/attend', params);
}

export async function getCurrentMeetingDetail(id: string = '0') {
  return request.get(`/api/meeting/detail?id=${id}`);
}
