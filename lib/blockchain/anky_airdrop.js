// lib/blockchain/anky_airdrop.js
const { ethers } = require('ethers');
const ANKY_AIRDROP_ABI = require('../../abis/AnkyAirdrop.json');

const MY_WALLET = '0xe4028BAe76CB622AD26e415819EB2940E969F9eD';

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// // Create contract instance
console.log(process.env.ANKY_AIRDROP_SMART_CONTRACT, wallet);
const ankyAirdropContract = new ethers.Contract(
  process.env.ANKY_AIRDROP_SMART_CONTRACT,
  ANKY_AIRDROP_ABI,
  wallet
);

console.log('after that');

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

async function getNftAccount(thisWallet) {
  // Interact with the ankyAirdropContract
  try {
    console.log(
      'This is the route for getting the TBA for a the Anky that this wallet owns',
      thisWallet
    );

    const userAnkyIndex = await getUserAnkyAirdrop(thisWallet); // To get the index of the anky that the user owns
    console.log('the user anky index is: ', userAnkyIndex);
    let hasAccount = await ankyAirdropContract.ownerToTBA(thisWallet);
    console.log('the has account variable is :', hasAccount);
    if (hasAccount === '0x0000000000000000000000000000000000000000') {
      console.log('inside the as account');
      // Call the createTBAforUsersAnky function
      const response = await ankyAirdropContract.createTBAforUsersAnky(
        thisWallet
      );
      console.log('Transaction hash:', response.hash);

      // Wait for the transaction to be mined
      const receipt = await response.wait();

      // Check logs to find the TBA address
      const TBACreatedEvent = ankyAirdropContract.filters.TBACreated(); // Get the event signature

      const eventLogs = receipt.events?.filter(
        x => x.topics.indexOf(TBACreatedEvent.topics[0]) >= 0
      );
      await new Promise(resolve => setTimeout(resolve, 3333));
      hasAccount = await ankyAirdropContract.ownerToTBA(thisWallet);
      console.log('IN HERE, this is the TBA for this users anky', hasAccount);

      return hasAccount;
    } else {
      console.log('The user has a TBA created, it is: ', hasAccount);
    }
    return hasAccount;
  } catch (error) {
    console.log('There was an error');
    console.log(error);
  }
}

async function getUserAnkyAirdrop(thisWallet) {
  console.log(
    'calling the ankyaidrop conteact to check the index of this anky',
    thisWallet
  );
  const response = await ankyAirdropContract.tokenOfOwnerByIndex(thisWallet, 0);
  console.log('the repsonse is: 0, ', response);
  const userAnkyIndex = Number(response);
  return userAnkyIndex;
}

module.exports = { getNftAccount };
