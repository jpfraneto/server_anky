const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const { getAddrByFid, getCastFromNeynar } = require("../../lib/neynar");
const prisma = require("../../lib/prismaClient");
const { SyndicateClient } = require("@syndicateio/syndicate-node");

const network = "base";

const privateKey = process.env.PRIVATE_KEY;

// // Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const ANKY_ON_A_FRAME_ABI = require("../../abis/AnkyOnAFrame.json");

const ankyOnAFrameContract = new ethers.Contract(
  "0x5fd77ab7fd080e3e6ccbc8fe7d33d8abd2fe65a5",
  ANKY_ON_A_FRAME_ABI,
  wallet
);

const syndicate = new SyndicateClient({
  token: () => {
    const apiKey = process.env.SYNDICATE_API_KEY;
    if (typeof apiKey === "undefined") {
      throw new Error(
        "SYNDICATE_API_KEY is not defined in environment variables."
      );
    }
    return apiKey;
  },
});

///// crypto-the-game //////////

router.get("/", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/ctg-1.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/ctg-1.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/crypto-the-game">
      <meta name="fc:frame:button:1" content="read more...">
    </head>
    </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    return res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
  <title>anky mint</title>
  <meta property="og:title" content="anky mint">
  <meta property="og:image" content="https://jpfraneto.github.io/images/ctg-2.png">
  <meta name="fc:frame" content="vNext">
  <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/ctg-2.png">

  <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/crypto-the-game">
  <meta name="fc:frame" content="vNext">     
</head>
</html>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
