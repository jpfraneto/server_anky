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

module.exports = router;
