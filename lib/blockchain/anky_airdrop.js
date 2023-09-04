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

async function getNftAccount(wallet) {
  // Interact with the ankyAirdropContract
  try {
    console.log(
      'This is the route for getting the TBA for a the Anky that the user owns',
      wallet
    );
    const userAnkyIndex = await getUserAnkyAirdrop(wallet); // To get the index of the anky that the user owns
    console.log('the user anky index is: ', userAnkyIndex);
    const hasAccount = await ankyAirdropContract.ownerToTBA(wallet);
    console.log('the has account is :', hasAccount);
    if (hasAccount === '0x0000000000000000000000000000000000000000') {
      const response = await ankyAirdropContract.createTBAforUsersAnky(wallet);
      console.log('response', response);
      return response;
    }
    return hasAccount;
  } catch (error) {
    console.log('There was an error');
    console.log(error);
  }
}

async function getUserAnkyAirdrop(wallet) {
  const response = await ankyAirdropContract.tokenOfOwnerByIndex(wallet, 0);
  console.log('in hereeeee, the errorr is', response);
  const userAnkyIndex = Number(response);
  return userAnkyIndex;
}

module.exports = { getNftAccount };
