const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
const { kv } = require("@vercel/kv");
const { getSSLHubRpcClient, Message } = require("@farcaster/hub-nodejs");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

if (typeof process.env.FARCASTER_DEVELOPER_MNEMONIC === "undefined") {
  throw new Error("FARCASTER_DEVELOPER_MNEMONIC is not defined");
}
const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;

if (typeof process.env.FARCASTER_DEVELOPER_FID === "undefined") {
  throw new Error("FARCASTER_DEVELOPER_FID is not defined");
}
const FARCASTER_DEVELOPER_FID = process.env.FARCASTER_DEVELOPER_FID;

const generate_signature = async function (public_key) {
  // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
  const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
    name: "Farcaster SignedKeyRequestValidator",
    version: "1",
    chainId: 10,
    verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
  };

  // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
  const SIGNED_KEY_REQUEST_TYPE = [
    { name: "requestFid", type: "uint256" },
    { name: "key", type: "bytes" },
    { name: "deadline", type: "uint256" },
  ];

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);

  const deadline = Math.floor(Date.now() / 1000) + 3 * 86400;
  // const deadline = 1705751578 + 3 * 86400;

  // Generates the signature
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(FARCASTER_DEVELOPER_FID),
      key: public_key,
      deadline: BigInt(deadline),
    },
  });

  return { deadline, signature };
};

router.get("/", async (req, res) => {
  try {
    const pollId = req.query["id"];
    const results = req.query["results"] === "true";
    let voted = req.query["voted"] === "true";

    if (!pollId) {
      return res.status(400).send("Missing poll ID");
    }

    let validatedMessage;
    try {
      const frameMessage = Message.decode(
        Buffer.from(req.body?.trustedData?.messageBytes || "", "hex")
      );
      const result = await client.validateMessage(frameMessage);
      if (result.isOk() && result.value.valid) {
        validatedMessage = result.value.message;
      }
    } catch (e) {
      return res.status(400).send(`Failed to validate message: ${e}`);
    }

    const buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
    const fid = validatedMessage?.data?.fid || 0;
    const votedOption = await kv.hget(`poll:${pollId}:votes`, `${fid}`);
    voted = voted || !!votedOption;

    if (buttonId > 0 && buttonId < 5 && !results && !voted) {
      let multi = kv.multi();
      multi.hincrby(`poll:${pollId}`, `votes${buttonId}`, 1);
      multi.hset(`poll:${pollId}:votes`, { [fid]: buttonId });
      await multi.exec();
    }

    let poll = await kv.hgetall(`poll:${pollId}`);
    if (!poll) {
      return res.status(400).send("Missing poll ID");
    }

    const imageUrl = `${process.env["HOST"]}/api/image?id=${poll.id}&results=${
      results ? "false" : "true"
    }&date=${Date.now()}${fid > 0 ? `&fid=${fid}` : ""}`;
    let button1Text = "View Results";
    if (!voted && !results) {
      button1Text = "Back";
    } else if (voted && !results) {
      button1Text = "Already Voted";
    } else if (voted && results) {
      button1Text = "View Results";
    }

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <title>Vote Recorded</title>
  <meta property="og:title" content="Vote Recorded">
  <meta property="og:image" content="${imageUrl}">
  <meta name="fc:frame" content="vNext">
  <meta name="fc:frame:image" content="${imageUrl}">
  <meta name="fc:frame:post_url" content="${process.env["HOST"]}/api/vote?id=${
      poll.id
    }&voted=true&results=${results ? "false" : "true"}">
  <meta name="fc:frame:button:1" content="${button1Text}">
</head>
<body>
  <p>${
    results || voted
      ? `You have already voted ${votedOption}`
      : `Your vote for ${buttonId} has been recorded for fid ${fid}.`
  }</p>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
