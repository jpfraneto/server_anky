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
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/elektronic.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/elektronic.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/electronic-music">
      <meta name="fc:frame:button:1" content="random">
    </head>
    </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/", async (req, res) => {
  console.log("inside the post route", req.query);
  let imageUrl;
  const fullUrl = req.protocol + "://" + req.get("host");

  const revealed = req.query.revealed;
  const chosenAnky = req.query.chosenAnky;
  const mint = req.query.mint;
  const anky = await prisma.generatedAnky.findUnique({
    where: { cid: req.query.cid },
  });

  const randomRecommendation = "";
  return res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>anky mint</title>
    <meta property="og:title" content="anky mint">
    <meta property="og:image" content="${anky.frameImageUrl}">
    <meta name="fc:frame:image" content="${anky.frameImageUrl}">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/electronic-music">
    <meta name="fc:frame:button:1" content="menu">   
    <meta name="fc:frame:button:2" content="mint 👽">
    <meta name="fc:frame:button:2:action" content="link">   
    <meta name="fc:frame:button:2:target" content="https://soundcloud.com/solee-music/sets/live-sets">   
    <meta name="fc:frame:button:3" content="3">   
    <meta name="fc:frame:button:4" content="4">   
    </head>
  </html>
    `);
  console.log("in here, the anky is: ", anky);
  console.log("m", mint, chosenAnky, revealed);
  if (mint == "0" && chosenAnky == "0" && revealed == "1") {
    console.log("right before the revealed route");
    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="${anky.frameImageUrl}">
      <meta name="fc:frame:image" content="${anky.frameImageUrl}">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/generated-anky?cid=${req.query.cid}&revealed=1&&chosenAnky=1&mint=0">
      <meta name="fc:frame:button:1" content="1">   
      <meta name="fc:frame:button:2" content="2">   
      <meta name="fc:frame:button:3" content="3">   
      <meta name="fc:frame:button:4" content="4">   
      </head>
    </html>
      `);
  } else if (mint == "0" && chosenAnky == "1" && revealed == "1") {
    console.log("after the choosing this anky route");
    const buttonIndex = req.body.untrustedData.buttonIndex;
    switch (buttonIndex) {
      case 1:
        imageUrl = anky.imageOneUrl;
        break;
      case 2:
        imageUrl = anky.imageTwoUrl;
        break;
      case 3:
        imageUrl = anky.imageThreeUrl;
        break;
      case 4:
        imageUrl = anky.imageFourUrl;
        break;
    }
    const existingVote = await prisma.vote.findUnique({
      where: {
        ankyCid_userFid: {
          ankyCid: req.query.cid,
          userFid: req.body.untrustedData.fid,
        },
      },
    });
    if (existingVote) {
      // Update the existing vote
      await prisma.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          voteIndex: buttonIndex - 1,
        },
      });
    } else {
      // Create a new vote record
      await prisma.vote.create({
        data: {
          ankyCid: req.query.cid,
          userFid: req.body.untrustedData.fid,
          voteIndex: buttonIndex - 1,
        },
      });
    }
    const votes = await prisma.vote.findMany({
      where: {
        ankyCid: req.query.cid,
      },
    });
    let voteCounts = [0, 0, 0, 0];
    votes.forEach((vote) => {
      if (vote.voteIndex >= 0 && vote.voteIndex < 4) {
        voteCounts[vote.voteIndex]++;
      }
    });
    // Calculate total votes for normalization
    const totalVotes = votes.length;

    // Calculate percentages for each option
    let votePercentages = voteCounts.map((count) => {
      return totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(2) : 0;
    });

    // Log the summary of votes
    console.log(`Vote summary in percentages for each option:`);
    console.log(`Option 1: ${votePercentages[0]}%`);
    console.log(`Option 2: ${votePercentages[1]}%`);
    console.log(`Option 3: ${votePercentages[2]}%`);
    console.log(`Option 4: ${votePercentages[3]}%`);

    // ON THIS RETURN I NEED TO ADD THE BLACK OVERLAY AND THE NUMBERS ON THE IMAGE DYNAMICALLY

    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/percentages.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/percentages.png">
      <meta name="fc:frame:post_url" content="https://www.anky.lat">
      <meta name="fc:frame:button:1" content="mint 👽">
      <meta name="fc:frame:button:1:action" content="link">   
      <meta name="fc:frame:button:1:target" content="https://www.anky.lat/mint-your-anky/${anky.cid}">   
      </head>
    </html>
      `);
  }

  // if (anky.ipfsMetadataHash) {
  //   switch (anky.chosenImageIndex) {
  //     case 1:
  //       imageUrl = anky.imageOneUrl;
  //       break;
  //     case 2:
  //       imageUrl = anky.imageTwoUrl;
  //       break;
  //     case 3:
  //       imageUrl = anky.imageThreeUrl;
  //       break;
  //     case 4:
  //       imageUrl = anky.imageFourUrl;
  //       break;
  //   }
  //   return res.status(200).send(`
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <title>anky mint</title>
  //     <meta property="og:title" content="anky mint">
  //     <meta property="og:image" content="${imageUrl}">
  //     <meta name="fc:frame:image" content="${imageUrl}">
  //     <meta name="fc:frame" content="vNext">
  //     <meta name="fc:frame:button:1" content="mint 👽">
  //     <meta name="fc:frame:button:1:action" content="post_redirect">
  //     <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/redirecter?cid=${req.query.cid}">
  //     </head>
  //   </html>
  //     `);
  // }
  if (anky.userFid !== req.body.untrustedData.fid) {
    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content=" https://jpfraneto.github.io/images/isnt-yours.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content=" https://jpfraneto.github.io/images/isnt-yours.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/generated-anky">
      <meta name="fc:frame:button:1" content="get yours by writing on anky">   
      <meta name="fc:frame:button:1:action" content="post_redirect">   
      </head>
    </html>
      `);
  }
  if (
    anky &&
    req.query.revealed == 1 &&
    req.query.choosingAnky == 1 &&
    req.query.chosenAnky == 1 &&
    req.query.mint == 1
  ) {
    console.log("it is time to mint!");

    // here i have to mint the anky to the user. but i cant keep paying for all the mints. how can i do this? i also can't keep paying for the openai credits. i'm draining my $ everywhere. how can i keep up? where do i keep up? what is this about?

    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/how-to.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/how-to.png">
      <meta name="fc:frame:post_url" content="https://www.anky.lat">
      </head>
    </html>
      `);
  }
  if (!anky) {
    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/error.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/error.png">
      <meta name="fc:frame:post_url" content="https://www.anky.lat">
      <meta name="fc:frame:button:1" content="write on anky">   
      <meta name="fc:frame:button:1:action" content="post_redirect">   
      </head>
    </html>
      `);
  }
  try {
    if (req.query.revealed == 1 && req.query.choosingAnky == 1) {
      if (!anky.metadataIPFSHash) {
        const ipfsHash = await uploadToPinataFromUrl(imageUrl);
        if (!ipfsHash || ipfsHash == null) return;
        const nftMetadata = {
          name: "you",
          description: anky.ankyBio,
          image: `ipfs://${ipfsHash}`,
        };
        const ipfsMetadataHash = await uploadMetadataToPinata(nftMetadata);
        console.log("the metadata was uploaded to pinata", ipfsMetadataHash);

        if (!ipfsMetadataHash || ipfsMetadataHash == null) return;

        await prisma.generatedAnky.update({
          where: { cid: req.query.cid },
          data: {
            chosenImageIndex: buttonIndex,
            imageIPFSHash: ipfsHash,
            metadataIPFSHash: ipfsMetadataHash,
          },
        });
      }

      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>anky mint</title>
          &chosenAnky=null
          <meta property="og:title" content="anky mint">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:button:1:action" content="post_redirect">   
          <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/redirecter?cid=${req.query.cid}">          
          <meta name="fc:frame:button:1" content="mint 👽"> 
          </head>
        </html>
          `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
