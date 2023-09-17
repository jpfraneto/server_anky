const { uploadToBundlr } = require('./bundlrSetup'); // Please replace with the correct path to your Bundlr upload code

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

module.exports = { createNotebookMetadata };
