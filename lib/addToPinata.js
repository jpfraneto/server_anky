const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const uploadText = async data => {
  const { text, wallet, date } = data;
  const pinataResponse = await uploadMetadata(wallet, text, date);
  console.log('The pinata upload was successful');
  return { pinata: pinataResponse };
};

const uploadImage = async file => {
  try {
    const data = new FormData();
    data.append('file', fs.createReadStream(file));
    data.append('pinataMetadata', '{"name": "pinnie"}');

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });
    resData = await res.json();
    console.log('File uploaded, CID:', resData.IpfsHash);
    return resData.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

const uploadMetadata = async (wallet, description, date) => {
  const now = new Date().getTime();
  const stringifiedDate = JSON.stringify(date);
  try {
    const data = JSON.stringify({
      pinataContent: {
        wallet: `${wallet}`,
        text: `${description}`,
        ankyverseDate: stringifiedDate,
      },
      pinataMetadata: {
        name: `${now}`,
      },
    });

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });
    const resData = await res.json();
    console.log('the resData is: ', resData);
    console.log('Metadata uploaded, CID:', resData.IpfsHash);
    return resData.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

const mintNft = async (CID, wallet) => {
  try {
    const data = JSON.stringify({
      recipient: `polygon:${wallet}`,
      metadata: `https://gateway.pinata.cloud/ipfs/${CID}`,
    });
    const res = await fetch(
      'https://staging.crossmint.com/api/2022-06-09/collections/default/nfts',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-client-secret': `${process.env.CROSSMINT_CLIENT_SECRET}`,
          'x-project-id': `${process.env.CROSSMINT_PROJECT_ID}`,
        },
        body: data,
      }
    );
    resData = await res.json();
    const contractAddress = resData.onChain.contractAddress;
    console.log('NFT Minted, smart contract:', contractAddress);
    console.log(
      `View NFT at https://testnets.opensea.io/assets/mumbai/${contractAddress}`
    );
  } catch (error) {
    console.log(error);
  }
};

const main = async (file, name, description, external_url, wallet) => {
  try {
    const imageCID = await uploadImage(file);
    const metadataCID = await uploadMetadata(
      name,
      description,
      external_url,
      imageCID
    );
    await mintNft(metadataCID, wallet);
  } catch (error) {
    console.log(error);
  }
};

// main(
//   './pinnie.png',
//   'Pinnie',
//   'A Pinata NFT made with Crossmint and Pinata',
//   'https://pinata.cloud',
//   '0x2Fd0BD0d1c846682F3730cB3F6c22052B43495A9'
// );

module.exports = {
  uploadText,
};
