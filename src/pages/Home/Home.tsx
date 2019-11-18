import React, { useState } from 'react';

import './Home.scss';
import { FaceApi, ImageApi } from '../../services';

interface IHomeProps {}

declare global {
  interface Window {
    cloudinary: any;
  }
}

let cloudinary = window.cloudinary;
const cloud_name = 'dwkngzetg';
cloudinary.setCloudName(cloud_name);
const API_KEY = '457584564884954';
const API_SECRET = '4A_4qgalJWBX5yvoZ65oYKwKDfw';
const cloudinaryOptions = {
  uploadPreset: 'icsuoo4d',
  theme: 'purple'
};

const Home: React.FunctionComponent<IHomeProps> = props => {
  const groupName = 'fea';
  const [personName, setPersonName] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const openWidget = () => {
    cloudinary.openUploadWidget(
      {
        ...cloudinaryOptions,
        folder: 'FaceApi/Khang',
        tags: ['khang']
      },
      function(error: any, result: any) {
        console.log('result', result);
      }
    );
  };

  const createGroup = async () => {
    const res = await FaceApi.createPersonGroup(groupName);
    console.log('res', res);
  };

  const getGroup = async () => {
    const res = await FaceApi.getPersonGroup(groupName);
    console.log('Group', res);
  };

  const getImage = async () => {
    const res: any = await ImageApi.getImageList();
    const imageUrlList = res.data.resources.map((item: any) => {
      return 'https://res.cloudinary.com/dwkngzetg/' + item.public_id;
    });
    setImageUrls((prev: string[]) => {
      return imageUrlList;
    });
    console.log('images', imageUrlList);
  };

  const createPerson = async () => {
    const res = await FaceApi.createPerson(personName);
    console.log('person name', res.personId);
  };

  const getAllPersonInGroup = async () => {
    const res = await FaceApi.getAllPerson();
    console.log('All person', res);
  };

  const addFace = async () => {
    const currentPersonId = 'cf61cc5c-4240-4f98-8c0e-c5362f54ac3a';
    imageUrls.forEach((url: string) => {
      const res = FaceApi.addFace(url, currentPersonId);
      console.log(`Adding ${url} to ${currentPersonId} success! ${res}`);
    });
  };

  return (
    <>
      <div className="home">
        <button onClick={openWidget}>Upload</button>
        <button onClick={createGroup}>Create person group</button>
        <button onClick={getGroup}>Get person group</button>
        <button onClick={getImage}>Get Image uploaded</button>
        <div>
          <input
            type="text"
            onChange={(e: any) => setPersonName(e.target.value)}
          />
          <button onClick={createPerson}>Create Person</button>
        </div>
        <button onClick={getAllPersonInGroup}>Get All Person In group</button>
        <button onClick={addFace}>Add faces to Person</button>
      </div>
    </>
  );
};

export default Home;
