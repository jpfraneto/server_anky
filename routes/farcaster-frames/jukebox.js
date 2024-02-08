const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const cheerio = require("cheerio");
const prisma = require("../../lib/prismaClient");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

///////////// GENERATED ANKY ////////////////////////

router.get("/", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>degen jukebox</title>
      <meta property="og:title" content="degen jukebox">
      <meta property="og:image" content="https://jpfraneto.github.io/images/jukebox.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/jukebox.png">

      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/jukebox">
      <meta name="fc:frame:button:1" content="what's live?">

    </head>
    </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

async function fetchOGData(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogTitle = $('meta[property="og:title"]').attr("content");

    return {
      ogImage,
      ogTitle,
    };
  } catch (error) {
    console.error("Error fetching OG data:", error);
    return {};
  }
}

router.post("/", async (req, res) => {
  let imageUrl, ogTitle, ogImage;
  const fullUrl = req.protocol + "://" + req.get("host");
  const fid = req.body.untrustedData.fid.toString();
  const buttonIndex = req.body.untrustedData.buttonIndex.toString();
  const recommendationLink = "https://youtu.be/2h1h1JdaWGk";
  const response = await fetchOGData(recommendationLink);
  ogImage = response.ogImage;
  ogTitle = response.ogTitle;
  try {
    return res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>jukebox</title>
    <meta property="og:title" content="jukebox">
    <meta property="og:image" content="${
      ogImage || "https://jpfraneto.github.io/images/jukebox.png"
    }">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="${
      ogImage || "https://jpfraneto.github.io/images/ravecaster.png"
    }">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/jukebox">
    <meta name="fc:frame:button:1" content="play music"> 
    <meta name="fc:frame:button:1:action" content="link">   
    <meta name="fc:frame:button:1:target" content="${recommendationLink}">     
    <meta name="fc:frame:button:2" content="add to queue">   
    <meta name="fc:frame:button:3" content="queue">   
    <meta name="fc:frame:button:4" content="listen 👽">
    <meta name="fc:frame:button:4:action" content="link">   
    <meta name="fc:frame:button:4:target" content="${"https://www.ravecaster.xyz"}">   
    </head>
  </html>
    `);
  } catch (error) {
    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>anky mint</title>
    <meta property="og:title" content="anky mint">
    <meta property="og:image" content="https://jpfraneto.github.io/images/error.png">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/error.png">

    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/ravecaster">
    <meta name="fc:frame" content="vNext">     
  </head>
  </html>
    </html>
    `);
  }
});

module.exports = router;
