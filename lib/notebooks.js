const { uploadToBundlr } = require('./bundlrSetup'); // Please replace with the correct path to your Bundlr upload code
const axios = require('axios');
const { ethers } = require('ethers');

const createNotebookMetadata = async (
  metadata,
  coverImage,
  backgroundImage
) => {
  try {
    console.log('inside the create metadata function');
    let coverImageCID, backgroundImageCID;
    if (coverImage)
      coverImageCID = await uploadToBundlr(coverImage.buffer, 'image');
    if (backgroundImage)
      backgroundImageCID = await uploadToBundlr(
        backgroundImage.buffer,
        'image'
      );

    const metadataWithImages = {
      ...metadata,
      coverImageCID: coverImageCID,
      backgroundImageCID: backgroundImageCID,
    };

    const metadataToUpload = JSON.stringify(metadataWithImages);
    // Upload the generated metadata to Bundlr
    const metadataCID = await uploadToBundlr(metadataToUpload);
    console.log('The metadata id after the call to bundlr is: ', metadataCID);

    return metadataCID;
  } catch (e) {
    console.error('Error creating notebook metadata:', e);
    throw e;
  }
};

async function processFetchedEulogia(rawEulogia) {
  try {
    // Extract metadata URI
    const metadataURI = rawEulogia.metadataURI;

    // Check and modify the metadataURI if it starts with "https://arweave.net/"
    let modifiedMetadataURI = metadataURI;
    const arweavePrefix = 'https://arweave.net/';
    if (modifiedMetadataURI.startsWith(arweavePrefix)) {
      modifiedMetadataURI = modifiedMetadataURI.replace(arweavePrefix, '');
    }

    // Fetch metadata from Arweave
    const metadata = await fetchJSONDataFromArweave(modifiedMetadataURI);
    metadata.coverImageUrl = `https://ipfs.io/ipfs/${metadata.coverImageCid}`;
    metadata.backgroundImageUrl = `https://ipfs.io/ipfs/${metadata.backgroundImageCid}`;

    // Process messages
    const processedMessages = await Promise.all(
      rawEulogia.messages.map(async message => {
        const content = await fetchPageDataFromArweave(message.cid);
        console.log('THE MESSAGE IS: ', message);
        console.log('the content is: ', content);
        console.log('ethers is:', ethers);
        return {
          writer: message[0],
          whoWroteIt: message[1],
          cid: message[2],
          content, // the fetched content
          timestamp: ethers.formatUnits(message[3]), // Convert BigNumber to regular number
        };
      })
    );

    // Create a formatted eulogia object
    console.log('the raw eulogia is: ', rawEulogia);
    const eulogia = {
      metadata,
      maxMessages: Number(metadata.maxPages),
      messages: processedMessages,
      messageCount: processedMessages.length,
    };

    return eulogia;
  } catch (error) {
    console.error('Error processing the fetched Eulogia:', error);
    throw error;
  }
}

async function fetchJSONDataFromArweave(arweaveCID) {
  const response = await axios.get(`https://www.arweave.net/${arweaveCID}`);
  console.log('the response is: ', response);
  if (!response.data) {
    throw new Error(`Failed to fetch page data for CID: ${arweaveCID}`);
  }
  const pageContent = await response.data; // get the string content
  return pageContent;
}

async function fetchPageDataFromArweave(arweaveCID) {
  const response = await axios.get(`https://www.arweave.net/${arweaveCID}`);

  if (!response.data) {
    throw new Error(`Failed to fetch page data for CID: ${arweaveCID}`);
  }
  const pageContent = await response.data; // get the string content
  return pageContent;
}

module.exports = { createNotebookMetadata, processFetchedEulogia };
