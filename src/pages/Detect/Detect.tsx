import React, { useState, useEffect, useCallback } from 'react';
import { FaceApi, ImageApi } from '../../services';
import { IMAGE } from '../../services/constants';
import personList from '../../services/groupPerson.json';
import './Detect.scss';

interface IHomeProps {}

declare global {
  interface Window {
    cloudinary: any;
  }
}

let cloudinary = window.cloudinary;

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

interface Person {
  name: string;
  persistedFaceIds?: string[];
  personId: string;
}

const Detect: React.FunctionComponent<IHomeProps> = props => {
  const [url, setUrl] = useState('');
  const [faceInfo, setFaceInfo] = useState<FaceInfo[]>([]);
  const [matchPerson, setMatchPerson] = useState();

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
    setUrl((prev: string) => {
      return (prev = images[images.length - 1]);
    });
    console.log('images', images[images.length - 1]);
  };

  const detect = async () => {
    if (!url) {
      return alert('Please upload your photo!');
    }
    try {
      const res = await FaceApi.detectFace(url);
      setFaceInfo(faceInfo => (faceInfo = res));
      console.log('Detect', res);
    } catch (error) {
      alert(`Error ${error}`);
    }
  };

  const findCandidate = useCallback(async () => {
    const faceId = faceInfo[0].faceId;
    const res = await FaceApi.identityFace(faceId);
    const candidates = res[0].candidates;
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
    const result = personList.find(p => p.personId === personId);
    console.log('result founded', result);
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
    <>
      <div className="detect">
        <button onClick={openUpload}>Open upload</button>
        <button onClick={getImage}>Get Image</button>
        <button onClick={detect}>Detect</button>
        <button onClick={findCandidate}>Identity</button>
      </div>
      <p className="result">
        <img src={url} alt="" width="100%" height="100%" />
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
            />
          ))}
      </p>
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
        {matchPerson && <li>{matchPerson.name}</li>}
      </ul>
    </>
  );
};

export default Detect;
