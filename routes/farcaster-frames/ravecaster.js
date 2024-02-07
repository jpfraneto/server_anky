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
      <title>electronic music</title>
      <meta property="og:title" content="electronic music">
      <meta property="og:image" content="https://jpfraneto.github.io/images/elektronic.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/elektronic.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/electronic-music">
      <meta name="fc:frame:button:2" content="random">
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
  let imageUrl;
  const fullUrl = req.protocol + "://" + req.get("host");
  const fid = req.body.untrustedData.fid.toString();
  const buttonIndex = req.body.untrustedData.buttonIndex.toString();
  const totalRecommendations =
    await prisma.electronicmusicrecommendation.count();
  const randomIndex = Math.floor(Math.random() * totalRecommendations);
  const randomRecommendation =
    await prisma.electronicmusicrecommendation.findMany({
      take: 1,
      skip: randomIndex,
    });
  let recommendation = randomRecommendation[0];
  const { ogImage, ogTitle } = await fetchOGData(recommendation.link);
  buttonTwoText = "add to library";
  if (buttonIndex == "2") {
    if (req.query.castHash) {
      await prisma.raver.update({
        where: { fid: fid },
        data: {
          likedRecommendations: {
            connect: { castHash: req.query.castHash },
          },
        },
      });
    }
    if (req.query.castHash) {
      buttonTwoText = "added to library";
    }
  }

  try {
    return res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>${ogTitle}</title>
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:image" content="${ogImage}">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="${ogImage}">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/electronic-music?castHash=${
      recommendation?.castHash || ""
    }">
    <meta name="fc:frame:button:1" content="my library"> 
    <meta name="fc:frame:button:1:action" content="link">   
    <meta name="fc:frame:button:1:target" content="https://www.ravecaster.xyz/user/${fid}">     
    <meta name="fc:frame:button:2" content="${buttonTwoText}">   
    <meta name="fc:frame:button:3" content="new random">   
    <meta name="fc:frame:button:4" content="listen 👽">
    <meta name="fc:frame:button:4:action" content="link">   
    <meta name="fc:frame:button:4:target" content="${
      recommendation?.link || "https://www.ravecaster.xyz"
    }">   
    </head>
  </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
