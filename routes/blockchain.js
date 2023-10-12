const express = require('express');
const { ethers } = require('ethers');
const { getNftAccount } = require('../lib/blockchain/anky_airdrop'); // Import the functions
const router = express.Router();
const ANKY_AIRDROP_ABI = require('../abis/AnkyAirdrop.json');
const ANKY_JOURNALS_ABI = require('../abis/AnkyJournals.json');

// Smart contract interactions

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

const ankyJournalsContract = new ethers.Contract(
  process.env.ANKY_JOURNALS_CONTRACT,
  ANKY_JOURNALS_ABI,
  wallet
);

router.get('/', (req, res) => {
  console.log('in the / route');
});

router.get('/getTBA/:wallet', async (req, res) => {
  console.log('in here', req.params.wallet);
  const response = await getNftAccount(req.params.wallet);
  return res.json({ ankyTba: response });
});

router.get('/createTBA/:wallet', async (req, res) => {
  console.log('HERE', req.params);
  const recipient = req.params.wallet;
  const hasTBACreated = await getNftAccount(recipient);
  return res.json({ hasTBACreated });
});

async function getWalletBalance(walletAddress) {
  try {
    console.log('inside the getwalletbalance function', walletAddress);
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    console.log('the balance of this wallet in eth is: ', balanceEth);
    return balanceEth;
  } catch (error) {
    console.error(
      `Failed to fetch balance for address ${walletAddress}`,
      error
    );
    return null;
  }
}

async function getWalletJournalBalance(walletAddress) {
  try {
    console.log('inside the getWallet journal function', walletAddress);
    const ownedJournals = await ankyJournalsContract.balanceOf(walletAddress);
    return ownedJournals;
  } catch (error) {
    console.log('There was an error fetching the journals');
    return error;
  }
}

// Route to airdrop the anky to the user that is making the request.
router.post('/airdrop', async (req, res) => {
  try {
    console.log('inside this route (airdrop)');
    const recipient = req.body.wallet;

    // Check if the recipient already owns an Anky Normal.
    const balanceNumber = await ankyAirdropContract.balanceOf(recipient);
    const minterBalance = Number(balanceNumber);
    console.log('the minter balance is: ', minterBalance);

    if (minterBalance !== 0) {
      const userAnky = await ankyAirdropContract.tokenOfOwnerByIndex(
        recipient,
        0
      );
      const userAnkyIndex = Number(userAnky);
      console.log('the user anky is:', userAnkyIndex);
      const tokenUri = await ankyAirdropContract.getTokenURI(userAnkyIndex);
      console.log('the token uri is:', tokenUri);
      return res.json({
        success: false,
        tokenUri,
        userAnkyIndex,
        msg: 'The user already owns an Anky NotebookKeeper',
      });
    }
    console.log('in here, right before');
    const response = await ankyAirdropContract.airdropNft(recipient);
    console.log('the response is: ', response);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: `Internal Server Error: ${error}` });
  }
});

router.post('/sendFirstJournal', async (req, res) => {
  try {
    console.log('the req.body is: ', req.body);
    const recipient = req.body.wallet;
    console.log(
      'right before sending the first journal to the user',
      recipient
    );
    const tx = await ankyJournalsContract.airdropFirstJournal(recipient);
    console.log('the user was aidropped her first anky journal');
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
