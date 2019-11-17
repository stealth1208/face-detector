import * as React from 'react';
import crypto from 'crypto';

interface IHomeProps {}

declare global {
  interface Window {
    cloudinary: any;
  }
}

let cloudinary = window.cloudinary;
cloudinary.setCloudName('dwkngzetg');
const cloud_name = 'dwkngzetg';
const API_KEY = '457584564884954';
const API_SECRET = '4A_4qgalJWBX5yvoZ65oYKwKDfw';

const Home: React.FunctionComponent<IHomeProps> = props => {
  const generateSignature = (timestamp: number) => {
    const paramString = `callback=http://widget.cloudinary.com/cloudinary_cors.html&timestamp=${timestamp}${API_SECRET}`;

    console.log('paramString', paramString);
    const digest = crypto
      .createHash('sha1')
      .update(paramString)
      .digest('hex');

    return digest;
  };

  const openWidget = () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const sign = generateSignature(timestamp);
    console.log('sign', sign);

    cloudinary.openUploadWidget(
      {
        timestamp,
        uploadPreset: 'j6rg84ul',
        // uploadSignature: sign,
        apiKey: API_KEY
      },
      function(error: any, result: any) {
        console.log('result', result);
      }
    );
  };
  return <button onClick={() => openWidget()}>Upload</button>;
};

export default Home;
