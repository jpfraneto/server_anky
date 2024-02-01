const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const allImages = require("../../lib/allImages.json");
const prisma = require("../../lib/prismaClient");

///////////// ANKYS ON A FRAME  ////////////////////////

router.get("/", async (req, res) => {
  try {
    let randomAnkyIndex = Math.floor(allImages.length * Math.random());
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="${allImages[randomAnkyIndex].imageAvailableUrl}">
      <meta name="fc:frame:image" content="${allImages[randomAnkyIndex].imageAvailableUrl}">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/anky-on-a-frame">
      <meta name="fc:frame" content="vNext">     
      <meta name="fc:frame:button:1" content="👽">
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
    let randomAnkyIndex = Math.floor(allImages.length * Math.random());
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky on a frame</title>
      <meta property="og:title" content="anky on a frame">
      <meta property="og:image" content="${allImages[randomAnkyIndex].imageAvailableUrl}">
      <meta name="fc:frame:image" content="${allImages[randomAnkyIndex].imageAvailableUrl}">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/anky-on-a-frame">
      <meta name="fc:frame" content="vNext">   
      <meta name="fc:frame:button:1" content="👽">  
    </head>
    </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
