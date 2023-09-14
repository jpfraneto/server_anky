const { uploadToBundlr } = require('./bundlrSetup'); // Please replace with the correct path to your Bundlr upload code

const createNotebookMetadata = async (title, description, prompts) => {
  const metadata = JSON.stringify({
    title,
    description,
    prompts,
  });

  try {
    console.log('inside the create metadata function');
    // Upload the generated metadata to Bundlr
    const metadataId = await uploadToBundlr(metadata);
    console.log('The metadata id after the call to bundlr is: ', metadataId);
    // Return the URL pointing to the uploaded metadata on Bundlr
    const metadataURI = `https://arweave.net/${metadataId}`;
    return metadataURI;
  } catch (e) {
    console.error('Error creating notebook metadata:', e);
    throw e;
  }
};

module.exports = { createNotebookMetadata };
