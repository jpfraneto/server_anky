const express = require('express');
const { ethers } = require('ethers');
const { getNftAccount } = require('../lib/blockchain/anky_airdrop'); // Import the functions
const { createNotebookMetadata } = require('../lib/notebooks');
const { uploadImageToPinata } = require('../lib/pinataSetup');
const router = express.Router();
const ANKY_NOTEBOOKS_ABI = require('../abis/AnkyNotebooks.json');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToBundlr } = require('../lib/bundlrSetup');

// Smart contract interactions
const network = 'baseGoerli';

const privateKey = process.env.PRIVATE_KEY;

// // Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const ankyNotebooksContract = new ethers.Contract(
  process.env.ANKY_NOTEBOOKS_CONTRACT,
  ANKY_NOTEBOOKS_ABI,
  wallet
);

router.post('/', async (req, res) => {
  console.log('inside the notebook post route', req.body);
  try {
    const metadataCID = await createNotebookMetadata(req.body);
    console.log('the metadata uri is: ', metadataCID);

    res.status(200).json({ metadataCID });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save metadata' });
  }
});

router.post(
  '/eulogia',
  upload.fields([{ name: 'coverImage' }, { name: 'backgroundImage' }]),
  async (req, res) => {
    try {
      console.log('inside the /eulogia/writing route', req.body);

      if (!req.files.coverImage || !req.files.backgroundImage) {
        return res
          .status(400)
          .json({ error: 'Both cover and background images are required.' });
      }

      const coverPinataCid = await uploadImageToPinata(
        req.files.coverImage[0].buffer
      );
      if (!coverPinataCid) {
        return res
          .status(500)
          .json({ error: 'Failed to upload cover image to Pinata.' });
      }

      const backgroundPinataCid = await uploadImageToPinata(
        req.files.backgroundImage[0].buffer
      );
      if (!backgroundPinataCid) {
        return res
          .status(500)
          .json({ error: 'Failed to upload background image to Pinata.' });
      }

      console.log(
        'the cover and background cids : ',
        coverPinataCid,
        backgroundPinataCid
      );

      const metadataToUpload = {
        backgroundImageCid: backgroundPinataCid,
        coverImageCid: coverPinataCid,
        title: req.body.title,
        description: req.body.description,
        maxPages: req.body.maxPages,
      };

      const cid = await uploadToBundlr(
        JSON.stringify(metadataToUpload),
        'text'
      );
      if (!cid) {
        return res
          .status(500)
          .json({ error: 'Failed to upload text to Bundlr.' });
      }

      res.status(200).json({ cid: cid });
    } catch (error) {
      console.error('Failed to upload:', error);
      res.status(500).json({ error: 'Failed to upload.' });
    }
  }
);

router.post('/eulogia/writing', async (req, res) => {
  try {
    console.log('inside the /eulogia/writing route', req.body);
    const text = req.body.text;

    const cid = await uploadToBundlr(text, 'text');
    res.status(200).json({ cid: cid });
  } catch (error) {
    console.error('Failed to upload text:', error);
    res.status(500).json({ error: 'Failed to upload text' });
  }
});

router.post('/upload-writing', async (req, res) => {
  try {
    console.log('inside the upload-writing route', req.body);
    const text = req.body.text;

    const cid = await uploadToBundlr(text, 'text');
    res.status(200).json({ cid: cid });
  } catch (error) {
    console.error('Failed to upload text:', error);
    res.status(500).json({ error: 'Failed to upload text' });
  }
});
// title: title,
// description: description,
// price: price,
// coverImage: coverImage,
// backgroundImage: backgroundImage,

module.exports = router;
