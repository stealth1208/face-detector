import axios from 'axios';
import { IMAGE } from './constants';

const Request = axios.create({
  baseURL: IMAGE.BASE_URI,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getImageList = () => {
  return Request.get('/image/list/khang.json');
};

export const ImageApi = {
  getImageList
};
