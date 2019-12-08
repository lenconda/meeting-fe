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
