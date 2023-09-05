const express = require('express');
const { ethers } = require('ethers');
const { getNftAccount } = require('../lib/blockchain/anky_airdrop'); // Import the functions
const router = express.Router();
const ANKY_AIRDROP_ABI = require('../abis/AnkyAirdrop.json');

// Smart contract interactions

process.env.ALCHEMY_API_KEY;
process.env.ALCHEMY_RPC_URL;

const network = 'baseGoerli';

const privateKey = process.env.PRIVATE_KEY;

// // Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const ankyAirdropContract = new ethers.Contract(
  process.env.ANKY_AIRDROP_CONTRACT_ADDRESS,
  ANKY_AIRDROP_ABI,
  wallet
);

router.post('/', async (req, res) => {
  const { title, description, numPages, price, supply } = req.body;
  console.log('inside the notebook post route', req.body);
  try {
    const metadataURI = await createMetadata(
      title,
      description,
      numPages,
      price,
      supply
    );
    res.status(200).json({ metadataURI });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save metadata' });
  }
});

module.exports = router;
