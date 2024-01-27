const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
const { getSSLHubRpcClient, Message } = require("@farcaster/hub-nodejs");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const client = getSSLHubRpcClient(HUB_URL);

router.get("/", async (req, res) => {
  try {
    let randomAnkyIndex = Math.floor(88 * Math.random());
    console.log("the random anky index is: ", randomAnkyIndex);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <title>you are it</title>
  <meta property="og:title" content="you are it">
  <meta property="og:image" content="https://ibb.co/R7jYYBq">
  <meta name="fc:frame" content="vNext">
  <meta name="fc:frame:image" content="https://jpfraneto.github.io/anky-images/${randomAnkyIndex}.png">
  <meta name="fc:frame:post_url" content="https://api.anky.lat/farcaster-frames">
  <meta name="fc:frame:button:1" content="<">
  <meta name="fc:frame:button:2" content="👽">
  <meta name="fc:frame:button:3" content=">">
</head>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
