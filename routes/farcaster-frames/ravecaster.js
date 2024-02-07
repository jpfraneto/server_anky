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
      <meta property="og:image" content="https://jpfraneto.github.io/images/ravecaster.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/ravecaster.png">

      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/ravecaster">
      <meta name="fc:frame:button:1" content="random">

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
  console.log("inside the post route");
  let imageUrl;
  const fullUrl = req.protocol + "://" + req.get("host");
  const fid = req.body.untrustedData.fid.toString();
  const buttonIndex = req.body.untrustedData.buttonIndex.toString();
  try {
    const castHash = req.query.castHash || "";
    const totalRecommendations =
      await prisma.electronicmusicrecommendation.count();
    let randomIndex = Math.floor(Math.random() * totalRecommendations);
    let recommendations = await prisma.electronicmusicrecommendation.findMany({
      take: 1,
      skip: randomIndex,
    });
    let recommendation = recommendations[0];
    let { ogImage, ogTitle } = await fetchOGData(recommendation.link);
    if (!ogImage || !ogTitle) {
      recommendations = await prisma.electronicmusicrecommendation.findMany({
        take: 1,
        skip: randomIndex,
      });
      recommendation = recommendations[0];
      let thisResponse = await fetchOGData(recommendation.link);
      ogImage = response.ogImage;
      ogTitle = response.ogTitle;
    }
    buttonTwoText = "add to library";
    if (buttonIndex == "2") {
      const recommendationExists =
        await prisma.electronicmusicrecommendation.findUnique({
          where: { castHash: castHash },
        });

      if (!recommendationExists) {
        return res.status(400).send("The castHash provided does not exist.");
      }

      try {
        let raver = await prisma.raver.findUnique({
          where: { fid: fid },
        });

        // If the raver doesn't exist, create it
        if (!raver) {
          raver = await prisma.raver.create({
            data: {
              fid: fid,
              likedRecommendations: {
                connect: { castHash: castHash },
              },
            },
          });
        } else {
          // If the raver exists, update their liked recommendations
          await prisma.raver.update({
            where: { fid: fid },
            data: {
              likedRecommendations: {
                connect: { castHash: castHash },
              },
            },
          });
        }
        buttonTwoText = "added to library";
      } catch (error) {
        // Log the error message
        console.error("Error connecting liked recommendation:", error);
        return res.status(500).send("Error processing request");
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
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/ravecaster?castHash=${
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
  } catch (error) {
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
  }
});

module.exports = router;
