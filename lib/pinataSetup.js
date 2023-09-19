const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const uploadImageToPinata = async imageBuffer => {
  try {
    const data = new FormData();
    data.append('file', imageBuffer, { filename: 'uploaded-image.jpg' }); // You can replace 'uploaded-image.jpg' with any name you like
    data.append('pinataMetadata', '{"name": "pinnie"}');

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });

    const resData = await res.json();
    if (res.ok) {
      console.log('File uploaded, CID:', resData.IpfsHash);
      return resData.IpfsHash;
    } else {
      console.error('Failed to upload to Pinata:', resData);
      return null;
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return null;
  }
};

module.exports = { uploadImageToPinata };
