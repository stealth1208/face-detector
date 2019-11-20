import React, { useState, useEffect, useCallback } from 'react';
import { FaceApi, ImageApi } from '../../services';
import { IMAGE, GROUP_NAME } from '../../services/constants';
import './Detect.scss';

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
  uploadPreset: IMAGE.UPLOAD_PRESET_NORMAL,
  theme: IMAGE.THEME
};

interface FaceInfo {
  faceAttributes: {
    gender: string;
    age: number;
  };
  faceId: string;
  faceRectangle: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export interface Person {
  name: string;
  persistedFaceIds?: string[];
  personId: string;
}

const Detect: React.FunctionComponent<IHomeProps> = props => {
  const [url, setUrl] = useState('');
  const [faceInfo, setFaceInfo] = useState<FaceInfo[]>([]);
  const [matchPerson, setMatchPerson] = useState();

  useEffect(() => {
    setFaceInfo([]);
    setMatchPerson({});
  }, [url]);

  const openWidget = () => {
    cloudinary.openUploadWidget(
      {
        ...cloudinaryOptions,
        folder: 'FaceApi/unknown',
        tags: ['unknown']
      },
      function(error: any, result: any) {
        if (result.event === 'success') {
          console.log('result', result.info.url);
          setUrl(result.info.url);
        }
      }
    );
  };

  const openUpload = () => {
    openWidget();
  };

  const getImage = async () => {
    const tag = 'unknown';
    const res: any = await ImageApi.getImageList(tag);
    const images = res.data.resources.map((item: any) => {
      return 'https://res.cloudinary.com/dwkngzetg/' + item.public_id;
    });
    // Get latest image
    setUrl((prev: string) => {
      return (prev = images[0]);
    });
    console.log('images', images[0]);
  };

  const detect = async () => {
    if (!url) {
      return alert('Please upload your photo!');
    }
    try {
      const res = await FaceApi.detectFace(url);
      setFaceInfo(res);
      console.log('Detect', res);
    } catch (error) {
      alert(`Error ${error}`);
    }
  };

  const findCandidate = useCallback(async () => {
    const faceId = faceInfo.map(({ faceId }) => faceId);
    const res = await FaceApi.identityFace(faceId);
    const candidates = res;
    const personId = candidates[0].personId;
    findPerson(personId);
    console.log('Candidate', res);
  }, [faceInfo]);

  useEffect(() => {
    if (faceInfo.length) {
      findCandidate();
    }
  }, [faceInfo, findCandidate]);

  const findPerson = async (personId: string) => {
    const personList = Store.getItem(GROUP_NAME);
    const result =
      personList &&
      JSON.parse(personList).find((p: Person) => p.personId === personId);
    console.log('Result founded', result);
    if (result) {
      setMatchPerson((matchPerson: Person) => {
        return {
          ...matchPerson,
          ...result
        };
      });
    }
    return result || 'No person match';
  };

  return (
    <div className="detect">
      <>
        <button onClick={openUpload}>Open upload</button>
        <button onClick={getImage}>Get Image</button>
        <button onClick={detect}>Detect</button>
        <button onClick={findCandidate}>Identity</button>
      </>
      <div className="result">
        <img src={url} alt="" />
        {faceInfo &&
          faceInfo.map((face, key) => (
            <div
              key={key}
              className="rectangle"
              style={{
                top: face.faceRectangle.top,
                left: face.faceRectangle.left,
                width: face.faceRectangle.width,
                height: face.faceRectangle.height
              }}
            >
              {matchPerson && (
                <div className="rectangle__name">{matchPerson.name}</div>
              )}
            </div>
          ))}
      </div>
      <ul>
        {faceInfo &&
          faceInfo.map(face =>
            Object.keys(face.faceAttributes).map((attr, key) => {
              const faceAttr: any = face.faceAttributes;
              const value = faceAttr[attr];
              return (
                <li key={key}>
                  {attr}: {value}
                </li>
              );
            })
          )}
      </ul>
    </div>
  );
};

export default Detect;
