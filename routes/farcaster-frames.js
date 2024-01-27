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
  
  <meta 
	property="eth:nft:collection" 
	content="hello world"
  />
  <meta 
    property="eth:nft:contract_address" 
    content="0x5806485215C8542C448EcF707aB6321b948cAb90"
  />
  <meta 
  property=":eth:nft:creator_address" 
  content="0xC3475034e6118938396FB1B3d1032c3ec65a142b"
  />
  <meta 
  property="eth:nft:schema" 
  content="erc721"
  />
  <meta 
  property="eth:nft:mint_status" 
  content="live"
  />
  <meta 
  property="eth:nft:mint_count" 
  content="27"
  />
  <meta 
  property="eth:nft:mint_url" 
  content="https://mint.anky.lat/about"
  />
  <meta 
  property="eth:nft:chain" 
  content="ethereum"
  />
 
</head>
<body>
  <p></p>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
