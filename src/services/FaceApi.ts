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

const createPerson = async (
  name: string,
  groupId: string = FACE.PERSON_GROUP_ID
) => {
  const res = await Request.post(`/persongroups/${groupId}/persons`, {
    name
  });
  return res.data;
};

const getAllPerson = async (groupId: string = FACE.PERSON_GROUP_ID) => {
  const res = await Request.get(`/persongroups/${groupId}/persons`);
  return res.data;
};

const addFace = async (
  faceUrl: string,
  personId: string,
  groupId: string = FACE.PERSON_GROUP_ID
) => {
  const res = await Request.post(
    `/persongroups/${groupId}/persons/${personId}/persistedFaces`,
    {
      url: faceUrl
    }
  );
  return res.data;
};

const trainPerson = async (groupId: string = FACE.PERSON_GROUP_ID) => {
  const res = await Request.post(`persongroups/${groupId}/train`);
  return res.data;
};

export const FaceApi = {
  createPersonGroup,
  getPersonGroup,
  createPerson,
  getAllPerson,
  addFace,
  trainPerson
};
