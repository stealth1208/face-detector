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
        folder: 'FaceApi/Minh',
        tags: ['minh']
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
    const tag = 'khang';
    const res: any = await ImageApi.getImageList(tag);
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
    const currentPersonId = '98715093-43b3-4b63-ad7e-cf6dfe2f2552';
    console.log('Starting', currentPersonId);
    imageUrls.forEach((url: string) => {
      setTimeout(() => {
        FaceApi.addFace(url, currentPersonId);
        console.log(`Adding ${url} to ${currentPersonId} success!`);
      }, 5000);
    });
  };

  const trainPerson = async () => {
    const process = await FaceApi.trainPerson();
    console.log('processing', process);
  };

  const getTrainingStatus = async () => {
    const res = await FaceApi.getTrainingStatus();
    console.log('Status', res);
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
        <button onClick={trainPerson}>Train Person</button>
        <button onClick={getTrainingStatus}>Get Training Status</button>
      </div>
    </>
  );
};

export default Home;
