const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const { getAddrByFid } = require("../../lib/neynar");
const prisma = require("../../lib/prismaClient");
const { SyndicateClient } = require("@syndicateio/syndicate-node");

///// MINT - THIS - ANKY //////////

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
      <meta property="og:image" content="https://jpfraneto.github.io/images/anky-ready-to-be-minted.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/anky-ready-to-be-minted.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${req.query.midjourneyId}&revealed=1&mint=0">
      <meta name="fc:frame:button:1" content="reveal 👽">
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
    const midjourneyId = req.query.midjourneyId;
    const revealed = Number(req.query.revealed);
    const mint = Number(req.query.mint);
    const userFid = req.body.untrustedData.fid;
    if (!userFid) return;
    const anky = await prisma.midjourneyOnAFrame.findUnique({
      where: { userFid: userFid },
    });

    if (mint == 1) {
      if (anky?.metadataIPFSHash == null)
        return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>anky mint</title>
          <meta property="og:title" content="anky mint">
          <meta property="og:image" content="https://jpfraneto.github.io/images/being-created.png">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/being-created.png">
          <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${req.query.midjourneyId}&revealed=1&mint=0">
        </head>
        </html>
        `);
      if (anky.alreadyMinted) {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
            <title>anky mint</title>
            <meta property="og:title" content="anky mint">
            <meta property="og:image" content="https://jpfraneto.github.io/images/one-per-person.png">
            <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/one-per-person.png">
      
            <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
            <meta name="fc:frame" content="vNext">     
          </head>
          </html>
            </html>
            `);
      }

      const addressFromFid = await getAddrByFid(userFid);
      const nonFormattedAnkyBalance = await ankyOnAFrameContract.balanceOf(
        addressFromFid
      );
      const usersAnkyBalance = ethers.formatUnits(nonFormattedAnkyBalance, 0);
      if (usersAnkyBalance > 0) {
        return res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
              <title>anky mint</title>
              <meta property="og:title" content="anky mint">
              <meta property="og:image" content="https://jpfraneto.github.io/images/one-per-person.png">
              <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/one-per-person.png">
        
              <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
              <meta name="fc:frame" content="vNext">     
            </head>
            </html>
              </html>
              `);
      }

      const ipfsRoute = `ipfs://${anky.metadataIPFSHash}`;
      if (ipfsRoute.length < 15)
        return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/error.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/error.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=false&mint=false">
        <meta name="fc:frame" content="vNext">     
      </head>
      </html>
        </html>
        `);

      if (usersAnkyBalance == 0) {
        if (midjourneyId == anky.imagineApiID) {
          const mintTx = await syndicate.transact.sendTransaction({
            projectId: "d0dd0664-198e-4615-8eb1-f0cf86dc3890",
            contractAddress: "0x5Fd77ab7Fd080E3E6CcBC8fE7D33D8AbD2FE65a5",
            chainId: 8453,
            functionSignature: "mint(address to, string ipfsRoute)",
            args: {
              to: addressFromFid,
              ipfsRoute: ipfsRoute,
            },
          });
          if (mintTx) {
            await prisma.midjourneyOnAFrame.update({
              where: { userFid: anky.userFid },
              data: { alreadyMinted: true },
            });
            return res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
              <title>anky mint</title>
              <meta property="og:title" content="anky mint">
              <meta property="og:image" content="https://jpfraneto.github.io/images/minted.png">
              <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/minted.png">
        
              <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
              <meta name="fc:frame" content="vNext">     
            </head>
            </html>
              </html>
              `);
          }
        } else {
          return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
            <title>anky mint</title>
            <meta property="og:title" content="anky mint">
            <meta property="og:image" content="https://jpfraneto.github.io/images/isnt-yours.png">
            <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/isnt-yours.png">
      
            <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
            <meta name="fc:frame" content="vNext">     
          </head>
          </html>
            </html>
            `);
        }
      }

      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="${revealedAnkyImageUrl}">
        <meta name="fc:frame:image" content="${revealedAnkyImageUrl}">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=0">
        <meta name="fc:frame" content="vNext">  
      </head>
      </html>
   
        </html>
        `);
    } else {
      if (
        anky?.imageAvailableUrl &&
        anky.imagineApiID == midjourneyId &&
        Number(userFid) === anky?.userFid
      ) {
        return res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
              <title>anky mint</title>
              <meta property="og:title" content="anky mint">
              <meta property="og:image" content="${anky.imageAvailableUrl}">
              <meta name="fc:frame:image" content="${anky.imageAvailableUrl}">
        
              <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
              <meta name="fc:frame" content="vNext">     
              <meta name="fc:frame:button:1" content="mint 🐒">   
            </head>
            </html>
          
              </html>
              `);
      } else {
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
          <title>anky mint</title>
          <meta property="og:title" content="anky mint">
          <meta property="og:image" content="https://jpfraneto.github.io/images/isnt-yours.png">
          <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/isnt-yours.png">
    
          <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed?=1&mint=0">
          <meta name="fc:frame" content="vNext">     
        </head>
        </html>
          </html>
          `);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
