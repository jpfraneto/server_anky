const express = require('express');
const { ethers } = require('ethers');
const { getNftAccount } = require('../lib/blockchain/anky_airdrop'); // Import the functions
const { createNotebookMetadata } = require('../lib/notebooks');
const router = express.Router();
const ANKY_NOTEBOOKS_ABI = require('../abis/AnkyNotebooks.json');

// Smart contract interactions

process.env.ALCHEMY_API_KEY;
process.env.ALCHEMY_RPC_URL;

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
  const {
    title,
    description,
    numPages,
    price,
    supply,
    ownerAddress,
    tbaAddress,
  } = req.body;
  console.log('inside the notebook post route', req.body);
  try {
    const metadataURI =
      'https://arweave.net/oHVbi7RFhjUAHf79PCYNvU0uLpz-Jf-mUg8tFeMfNIY';
    // const metadataURI = await createNotebookMetadata(
    //   title,
    //   description,
    //   numPages,
    //   price,
    //   supply
    // );
    console.log('the metadata uri is: ', metadataURI);

    res.status(200).json({ metadataURI });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save metadata' });
  }
});

module.exports = router;
