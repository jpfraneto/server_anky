const express = require("express");
const { ethers } = require("ethers");
const router = express.Router();
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const ANKY_WRITERS_ABI = require("../abis/AnkyWriters.json");

// Smart contract interactions

const network = "base_sepolia";

const privateKey = process.env.PRIVATE_KEY;

// // Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_ALCHEMY_RPC_URL
);
const wallet = new ethers.Wallet(privateKey, provider);

const ankyWritersContract = new ethers.Contract(
  process.env.ANKY_JOURNALS_CONTRACT,
  ANKY_WRITERS_ABI,
  wallet
);

router.get("/", (req, res) => {
  console.log("in the writers route");
});

module.exports = router;
