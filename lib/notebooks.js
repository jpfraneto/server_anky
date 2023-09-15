const { uploadToBundlr } = require('./bundlrSetup'); // Please replace with the correct path to your Bundlr upload code

const createNotebookMetadata = async metadata => {
  const metadataToUpload = JSON.stringify(metadata);

  try {
    console.log('inside the create metadata function');
    // Upload the generated metadata to Bundlr
    const metadataCID = await uploadToBundlr(metadataToUpload);
    console.log('The metadata id after the call to bundlr is: ', metadataCID);

    return metadataCID;
  } catch (e) {
    console.error('Error creating notebook metadata:', e);
    throw e;
  }
};

module.exports = { createNotebookMetadata };
