import React, { useState } from 'react';
import './Home.scss';
import { FaceApi, ImageApi } from '../../services';
import { IMAGE, GROUP_NAME } from '../../services/constants';
import { Person } from '../Detect/Detect';

interface IHomeProps {}

declare global {
  interface Window {
    cloudinary: any;
  }
}

let cloudinary = window.cloudinary;
let Store = window.localStorage;

cloudinary.setCloudName(IMAGE.CLOUD_NAME);
const cloudinaryOptions = {
  uploadPreset: IMAGE.UPLOAD_PRESET,
  theme: 'purple'
};

const Home: React.FunctionComponent<IHomeProps> = props => {
  const [personName, setPersonName] = useState('');
  const [personId, setPersonId] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [personToDelete, setPersonToDelete] = useState('');

  const createGroup = async () => {
    const res = await FaceApi.createPersonGroup(GROUP_NAME);
    console.log('res', res);
  };

  const getGroup = async () => {
    const res = await FaceApi.getPersonGroup(GROUP_NAME);
    console.log('Group', res);
  };

  const updatePersonList = (res: any) => {
    Store.setItem(GROUP_NAME, JSON.stringify(res));
  };

  const openWidget = () => {
    if (!personName) {
      return;
    }
    cloudinary.openUploadWidget(
      {
        ...cloudinaryOptions,
        folder: `FaceApi/${personName.toUpperCase()}`,
        tags: [`${personName}`]
      },
      function(error: any, result: any) {
        if (result.event === 'success') {
          console.log('result', result.info.url);
        }
      }
    );
  };

  const getImage = async () => {
    const res: any = await ImageApi.getImageList(personName);
    const imageUrlList = res.data.resources.map((item: any) => {
      return 'https://res.cloudinary.com/dwkngzetg/' + item.public_id;
    });
    setImageUrls(imageUrlList);
    console.log('imageUrlList', imageUrlList);
  };

  const createPerson = async () => {
    const res = await FaceApi.createPerson(personName);
    setPersonId(res.personId);
    console.log(`Created person ${personName} with id ${res.personId}`);
  };

  const getAllPersonInGroup = async () => {
    const res = await FaceApi.getAllPerson();
    updatePersonList(res);
    console.log(`All person in group ${GROUP_NAME}`, res);
  };

  const sleep = (s = 5) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  };

  const addFace = async () => {
    if (!imageUrls.length) {
      return alert('Not found url!');
    }

    const pId = getPersonId(personName) || personId;

    if (!pId && !personId) {
      return alert('Person not found!');
    }

    imageUrls.forEach(async (url: string) => {
      FaceApi.addFace(url, pId);
      console.log(`Adding ${url} to ${pId} success!`);
      await sleep(5);
    });
  };

  const trainPerson = async () => {
    const process = await FaceApi.trainPerson();
    console.log(`Processing person ${personName} ${personId}`, process);
  };

  const getTrainingStatus = async () => {
    const res = await FaceApi.getTrainingStatus();
    console.log(`Status training of ${personId}`, res);
  };

  // Assume name is unique
  const getPersonId = (name: string) => {
    const getList = Store.getItem(GROUP_NAME);
    const currentList = getList && JSON.parse(getList);
    const person = currentList.find((item: Person) => item.name === name);
    if (person) {
      setPersonId(person.personId);
      return person.personId;
    }
    return '';
  };

  const deletePerson = async () => {
    await FaceApi.deletePerson(personToDelete);
    const getList = Store.getItem(GROUP_NAME);
    const currentList = getList && JSON.parse(getList);
    const newList = currentList.filter(
      (item: Person) => item.personId !== personToDelete
    );
    updatePersonList(newList);
    console.log(`Person ${personToDelete} deleted!`);
  };

  return (
    <>
      <div className="home">
        <button onClick={createGroup}>Create person group</button>
        <button onClick={getGroup}>Get person group</button>
        <button onClick={getAllPersonInGroup}>Get All Person In group</button>
        <div>
          <input
            type="text"
            onChange={(e: any) => setPersonName(e.target.value)}
          />
          <button onClick={createPerson}>Create Person</button>
          <button onClick={openWidget}>Upload for {personName}</button>
          <button onClick={getImage}>Get Image of {personName}</button>
          <button onClick={addFace}>Add faces to {personName}</button>
          <button onClick={trainPerson}>Train {personName}</button>
          <button onClick={getTrainingStatus}>Get Training Status</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Person id to delete"
            onChange={(e: any) => setPersonToDelete(e.target.value)}
          />
          <button onClick={deletePerson}>Delete Person</button>
        </div>
      </div>
    </>
  );
};

export default Home;
