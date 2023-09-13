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
    return balanceEth;
  } catch (error) {
    console.error(
      `Failed to fetch balance for address ${walletAddress}`,
      error
    );
    return null;
  }
}

// Route to airdrop the anky to the user that is making the request.
router.post('/airdrop', async (req, res) => {
  try {
    console.log('inside this route (airdrop)');
    const recipient = req.body.wallet;

    const balance = await getWalletBalance(recipient);
    if (Number(balance) === 0) {
      console.log('sending some funds to user');
      const amountToSend = ethers.parseEther('0.005'); // 0.01 ETH in wei
      const ethTx = await wallet.sendTransaction({
        to: recipient,
        value: amountToSend,
      });

      console.log('ETH transaction hash:', ethTx.hash);
      await ethTx.wait(); // Wait for the transaction to be mined
    }

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
    const tx = await ankyAirdropContract.airdropNft(recipient);
    console.log('IN HERE, the tx is:', tx);
    const response = await tx.wait();
    console.log('The response for the airdrop is: ', response);

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
