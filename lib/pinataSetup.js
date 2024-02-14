require("dotenv").config();
const FormData = require("form-data");
const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
const axiosRetry = require("axios-retry");
const JWT = `Bearer ${process.env.PINATA_JWT}`;

const uploadToPinataFromUrl = async (sourceUrl) => {
  const data = new FormData();

  const response = await axios.get(sourceUrl, {
    responseType: "stream",
  });
  data.append(`file`, response.data);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          Authorization: JWT,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

const uploadImageToPinata = async (stream, cid) => {
  try {
    try {
      const options = {
        pinataMetadata: {
          name: `${cid}.png`,
          keyvalues: {
            id: cid,
          },
        },
        pinataOptions: {
          cidVersion: 0,
        },
      };
      console.log("in here the options are: ", options);
      // Upload the file stream to Pinata
      const res = await pinata.pinFileToIPFS(stream, options);

      // Check the response from Pinata and handle accordingly
      if (res && res.IpfsHash) {
        console.log("File uploaded, CID:", res.IpfsHash);
        return res.IpfsHash;
      } else {
        console.error("Failed to upload to Pinata:", res);
        return null;
      }
    } catch (error) {
      console.error("Error 2 uploading to Pinata:", error);
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
  uploadToPinataFromUrl,
};
