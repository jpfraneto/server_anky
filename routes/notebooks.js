const express = require('express');
const { ethers } = require('ethers');
const { getNftAccount } = require('../lib/blockchain/anky_airdrop'); // Import the functions
const { createNotebookMetadata } = require('../lib/notebooks');
const router = express.Router();
const ANKY_NOTEBOOKS_ABI = require('../abis/AnkyNotebooks.json');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
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
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('inside the eulogia post route', req.body);
    console.log('Request body:', req.body);
    console.log('Files:', req.files);
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    const backgroundImage = req.files.backgroundImage
      ? req.files.backgroundImage[0]
      : null;

    try {
      const metadataCID = await createNotebookMetadata(
        req.body,
        coverImage,
        backgroundImage
      );

      console.log('the metadata uri is: ', metadataCID);

      res.status(200).json({ metadataCID });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to save metadata' });
    }
  }
);

router.post('/eulogia/writing', async (req, res) => {
  try {
    console.log('inside the /eulogia/writing route', req.body);
    const text = req.body.text;
    console.log('the text is: ', text);
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
