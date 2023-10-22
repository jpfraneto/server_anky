const { uploadToBundlr } = require('./bundlrSetup'); // Please replace with the correct path to your Bundlr upload code
const axios = require('axios');
const { ethers } = require('ethers');

const createAnkyDementorCid = async ankyResponse => {
  try {
    const metadataToUpload = JSON.stringify(ankyResponse);
    // Upload the generated metadata to Bundlr
    const metadataCID = await uploadToBundlr(metadataToUpload);
    console.log(
      'The metadata id after the call to bundlr (creating the anky dementor cid) is: ',
      metadataCID
    );

    return metadataCID;
  } catch (e) {
    console.error('Error creating notebook metadata:', e);
    throw e;
  }
};

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

async function processFetchedTemplate(rawTemplate) {
  console.log('IN HERES', rawTemplate);
  try {
    // Check and modify the metadataURI if it starts with "https://arweave.net/"
    let modifiedMetadataURI = rawTemplate.metadataCID;
    const arweavePrefix = 'https://arweave.net/';
    if (modifiedMetadataURI && modifiedMetadataURI.startsWith(arweavePrefix)) {
      modifiedMetadataURI = modifiedMetadataURI.replace(arweavePrefix, '');
    }

    // Convert the raw data into a formatted object
    const metadata = await metadataUrlToObject(modifiedMetadataURI);
    const template = {
      templateId: rawTemplate[0],
      creator: rawTemplate[1],
      metadata,
      price: ethers.formatEther(rawTemplate[3]), // Convert BigNumber to a readable string in Ether
      numberOfPrompts: ethers.formatUnits(rawTemplate[4], 0),
      supply: ethers.formatUnits(rawTemplate[5], 0), // Convert BigNumber to a readable string (assuming supply is a whole number)
    };

    return template;
  } catch (error) {
    console.error('Error processing the fetched template:', error);
    throw error; // Re-throw the error after logging to ensure it's handled further up
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

async function metadataUrlToObject(cid) {
  try {
    const response = await axios.get(`https://www.arweave.net/${cid}`);
    console.log('the metadataaaaa is: ', response);
    const templateContent = await response.data;
    return templateContent;
  } catch (error) {
    console.error('There was a problem with fetching the metadata:', error);
  }
}

async function fetchPageDataFromArweave(arweaveCID) {
  const response = await axios.get(`https://www.arweave.net/${arweaveCID}`);

  if (!response.data) {
    throw new Error(`Failed to fetch page data for CID: ${arweaveCID}`);
  }
  const pageContent = await response.data; // get the string content
  return pageContent;
}

module.exports = {
  createNotebookMetadata,
  processFetchedEulogia,
  processFetchedTemplate,
  createAnkyDementorCid,
};
