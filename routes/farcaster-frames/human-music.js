const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const prisma = require("../../lib/prismaClient");
const {
  uploadToPinataFromUrl,
  uploadMetadataToPinata,
} = require("../../lib/pinataSetup");
const { getCastFromNeynar } = require("../../lib/neynar");
const { createAnkyFromPrompt } = require("../../lib/midjourney");

///////////// GENERATED ANKY ////////////////////////

router.get("/", async (req, res) => {
  try {
    console.log("inside the human music route");
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>human music</title>
      <meta property="og:title" content="human-music">
      <meta property="og:image" content="https://jpfraneto.github.io/images/human-music.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/human-music.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/human-music">
      <meta name="fc:frame:button:1" content="add to human-music">
      <meta name="fc:frame:input:text" content="https://www.youtu..."
    </head>
    </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/", async (req, res) => {
  const recommendation = req.body.untrustedData.inputText;
  const fid = req.body.untrustedData.fid;
  console.log("the recommendation is: ", recommendation);
  console.log("the fid is: ", fid);
  const musics = await prisma.humanmusic.findMany({});
  console.log("the musics are: ", musics);

  const prismaResponse = await prisma.humanmusic.upsert({
    where: {
      fid: fid.toString(), // Condition to find the record to update
    },
    update: {
      recommendation: recommendation, // Fields to update if the record is found
    },
    create: {
      fid: fid.toString(), // Data to create if the record is not found
      recommendation: recommendation,
    },
  });

  let imageUrl;
  const fullUrl = req.protocol + "://" + req.get("host");
  try {
    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/thank-you.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/thank-you.png">
      </head>
    </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
