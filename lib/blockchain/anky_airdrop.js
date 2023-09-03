// lib/blockchain/anky_airdrop.js
const { ethers } = require('ethers');
const ANKY_AIRDROP_ABI = require('../../abis/AnkyAirdrop.json');
const REGISTRY_ABI = require('../../abis/Registry.json');

const MY_WALLET = '0xe4028BAe76CB622AD26e415819EB2940E969F9eD';
const baseGoerli = 84531;

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// // Create contract instance
const ankyAirdropContract = new ethers.Contract(
  process.env.ANKY_AIRDROP_CONTRACT_ADDRESS,
  ANKY_AIRDROP_ABI,
  wallet
);
const registryContract = new ethers.Contract(
  process.env.REGISTRY_CONTRACT_ADDRESS,
  REGISTRY_ABI,
  wallet
);
// ... other contracts

async function createTBAforNFT(wallet) {
  // Interact with the ankyAirdropContract
  try {
    console.log('calling the createTBAforNFT function');
    const userAnkyIndex = await getUserAnkyAirdrop(wallet);
    console.log('in here, user', userAnkyIndex);
    const initData = '0x';

    const response = await registryContract.createAccount(
      process.env.ACCOUNT_CONTRACT_ADDRESS,
      baseGoerli,
      process.env.ANKY_AIRDROP_CONTRACT_ADDRESS,
      userAnkyIndex,
      0,
      initData
    );
    console.log(
      'The respnse after calling the function that creates tha anky for the user is: ',
      response
    );
    return response;
  } catch (error) {
    console.log('There was an error');
    console.log(error);
  }
}

async function getNftAccount(wallet) {
  // Interact with the ankyAirdropContract
  try {
    console.log(
      'This is the route for getting the TBA for a the Anky that the user owns',
      wallet
    );
    const userAnkyIndex = await getUserAnkyAirdrop(wallet);
    const response = await registryContract.account(
      process.env.ACCOUNT_CONTRACT_ADDRESS,
      baseGoerli,
      process.env.ANKY_AIRDROP_CONTRACT_ADDRESS,
      userAnkyIndex,
      0
    );
    console.log('The ethereum account for this Anky as a TBA is: ', response);
    return response;
  } catch (error) {
    console.log('There was an error');
    console.log(error);
  }
}

async function getUserAnkyAirdrop(wallet = MY_WALLET) {
  const response = await ankyAirdropContract.tokenOfOwnerByIndex(wallet, 0);
  const userAnkyIndex = Number(response);
  console.log('The users anky tokenId is: ', userAnkyIndex);
  return userAnkyIndex;
}

module.exports = { getNftAccount, createTBAforNFT };
