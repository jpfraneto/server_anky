require("dotenv").config();
const FormData = require("form-data");
const fetch = require("node-fetch");

const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

const uploadImageToPinata = async (imageBuffer, cid) => {
  try {
    const data = new FormData();
    data.append("file", imageBuffer, { filename: `${cid}.png` }); // You can replace 'uploaded-image.jpg' with any name you like
    data.append("pinataMetadata", '{"name": "anky"}');

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });

    const resData = await res.json();
    if (res.ok) {
      console.log("File uploaded, CID:", resData.IpfsHash);
      return resData.IpfsHash;
    } else {
      console.error("Failed to upload to Pinata:", resData);
      return null;
    }
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return null;
  }
};

const uploadMetadataToPinata = async (metadata) => {
  try {
    console.log("THE METADATA IS: ", metadata);
    const res = await pinata.pinJSONToIPFS(metadata);
    console.log("the res after uploading the json is:", res);
    return res.IpfsHash;
  } catch (error) {
    console.log("there was an error uploading the metadata to pinata", error);
  }
};

const newUploadImageToPinata = async (imageBuffer, cid) => {
  try {
    const data = new FormData();
    data.append("file", imageBuffer, { filename: `${cid}.png` });
    data.append("pinataMetadata", '{"name": "anky"}');
    const res = await pinata.pinFileToIPFS(data);
    console.log("the res from pinata is:", res);
    return res.IpfsHash;
  } catch (error) {
    console.log("there was an error uploading the image to pinata", error);
  }
};

module.exports = {
  uploadImageToPinata,
  newUploadImageToPinata,
  uploadMetadataToPinata,
};
