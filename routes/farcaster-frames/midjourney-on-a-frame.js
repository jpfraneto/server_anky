const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ethers } = require("ethers");
const prisma = require("../../lib/prismaClient");

///////////// MIDJOURNEY ON A FRAME  ////////////////////////

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
      <meta property="og:image" content="https://jpfraneto.github.io/images/midjourney_on_a_frame.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/midjourney_on_a_frame.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/midjourney-on-a-frame?paso=1">
      <meta name="fc:frame:button:1" content="comenzar">
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
    const paso = req.query.paso;
    const userFid = req.body.untrustedData.fid;
    const thisUserAnky = await prisma.midjourneyOnAFrame.findUnique({
      where: { userFid: userFid },
    });
    if (thisUserAnky && thisUserAnky.alreadyMinted) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="${thisUserAnky.imageAvailableUrl}">
        <meta name="fc:frame:image" content="${thisUserAnky.imageAvailableUrl}">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/midjourney-on-a-frame?paso=2&one-per-person">
        <meta name="fc:frame" content="vNext">    
        <meta name="fc:frame:button:1" content="try again">
      </head>
      </html>
      <p>you already minted, this is your anky.</p>
        </html>
        `);
    }

    const frameCastHash = process.env.FRAME_CAST_HASH;
    const response = await getCastFromNeynar(frameCastHash, userFid);
    const casts = response.data.result.casts;

    casts.shift();
    const thisUserCast = casts.filter(
      (x) => Number(x.author.fid) === Number(userFid)
    );
    const moreFiltered = thisUserCast.filter(
      (x) => x.parentHash == process.env.FRAME_CAST_HASH
    );
    const evenMoreFiltered = moreFiltered.filter(
      (x) => Number(x.parentAuthor?.fid) === 16098
    );
    if (evenMoreFiltered.length > 1) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/commented-more-than-once.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/commented-more-than-once.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/midjourney-on-a-frame?paso=2&one-per-person">
        <meta name="fc:frame" content="vNext">    
        <meta name="fc:frame:button:1" content="try again">
      </head>
      </html>
        </html>
        `);
    } else if (evenMoreFiltered.length == 0) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/welcome-message.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/welcome-message.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/midjourney-on-a-frame?paso=2&comment=i-replied">
        <meta name="fc:frame" content="vNext">    
        <meta name="fc:frame:button:1" content="i replied">
      </head>
      </html>
        </html>
        `);
    } else {
      // CHECK THAT THE USER HASN'T SENT A REQUEST YET
      const thisUserAnkyCreation = await prisma.midjourneyOnAFrame.findUnique({
        where: { userFid: userFid },
      });
      if (!thisUserAnkyCreation) {
        const responseFromMidjourney = await createAnkyFromPrompt(
          evenMoreFiltered[0].text,
          userFid,
          evenMoreFiltered[0].hash
        );
      }

      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/being-created.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/being-created.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/midjourney-on-a-frame?paso=2">
        <meta name="fc:frame" content="vNext">    
      </head>
      </html>
        </html>
        `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
