const Bundlr = require('@bundlr-network/client');
const fs = require('fs');
const { Readable } = require('stream');

const currency = 'ethereum';

const uploadToBundlr = async text => {
  const bundlr = new Bundlr(
    'https://node2.bundlr.network',
    currency,
    process.env.PRIVATE_KEY
  );
  console.log('Inside the upload to bundlr function', text);
  console.log(`wallet address = ${bundlr.address}`);
  const tags = [{ name: 'Content-Type', value: 'text/plain' }];

  try {
    let uploader = bundlr.uploader.chunkedUploader;
    // This needs to be updated with the text that the user will write.
    console.log('in here, the text is: ', text);
    const dataStream = Readable.from([text]);
    response = await uploader.uploadData(dataStream, tags);
    console.log(
      `Read Stream uploaded ==> https://arweave.net/${response.data.id}`
    );
    return response.data.id;
  } catch (e) {
    console.log('Error uploading file ', e);
  }
  console.log('the response is: ', response);
};

module.exports = { uploadToBundlr };
