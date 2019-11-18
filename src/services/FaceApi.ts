import axios from 'axios';
import { FACE } from './constants';

const Request = axios.create({
  baseURL: FACE.BASE_URI,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': FACE.KEY
  }
});

const createPersonGroup = (groupName: string) => {
  return Request.put(`/persongroups/${groupName}`, {
    name: 'Khang'
  });
};

const getPersonGroup = (groupName: string) => {
  return Request.get(`/persongroups/${groupName}`);
};

export const FaceApi = {
  createPersonGroup,
  getPersonGroup
};
