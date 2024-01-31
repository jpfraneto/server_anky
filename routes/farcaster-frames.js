const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
const { getSSLHubRpcClient, Message } = require("@farcaster/hub-nodejs");
const { SyndicateClient } = require("@syndicateio/syndicate-node");
const { getCastFromNeynar } = require("../lib/neynar");
const { createAnkyFromPrompt } = require("../lib/midjourney");

const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");
const rateLimit = require("express-rate-limit");

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

// Define the rate limiter
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1, // limit each IP to 1 requests per windowMs
  message:
    "Too many accounts created from this IP, please try again after an hour",
  headers: true,
});

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const client = getSSLHubRpcClient(HUB_URL);

const postRoute = "http://localhost:3000";

router.get("/", async (req, res) => {
  try {
    let randomAnkyIndex = Math.floor(88 * Math.random());
    const fullUrl = req.protocol + "://" + req.get("host");
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
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames">
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
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/", async (req, res) => {
  try {
    let randomAnkyIndex = Math.floor(88 * Math.random());
    const fullUrl = req.protocol + "://" + req.get("host");
    console.log(fullUrl);

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
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames">
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
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

// <meta name="fc:frame:button:2" content="remind me later">
// <meta name="fc:frame:button:3" content="nope and i won't">

router.get("/write", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>anky</title>
    <meta property="og:title" content="design everydays">
    <meta property="og:image" content="https://jpfraneto.github.io/images/3.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/3.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/write">
    <meta name="fc:frame:button:1" content="trigger me">

   
  </head>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/write", createAccountLimiter, async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/html");
    const fullUrl = req.protocol + "://" + req.get("host");
    let newUrl = `https://www.anky.lat/tell-us-who-you-are`;
    if (req.body.untrustedData.buttonIndex == 1) {
      const userResponse = await neynarClient.lookupUserByFid(
        req.body.untrustedData.fid
      );
      const username = userResponse.result.user.username;
      console.log("the username is: ", username);

      let castOptions = {
        text: `You told me to nudge you @${username}.\n\n Go and write on anky!`,
        embeds: [{ url: "https://www.anky.lat/tell-us-who-you-are" }],
        signer_uuid: process.env.MFGA_SIGNER_UUID,
      };
      const response = await axios.post(
        "https://api.neynar.com/v2/farcaster/cast",
        castOptions,
        {
          headers: {
            api_key: process.env.MFGA_API_KEY,
          },
        }
      );
      console.log("the cast was sent", response.data.cast);
      res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>anky</title>
      <meta property="og:title" content="anky">
      <meta property="og:image" content="https://jpfraneto.github.io/images/6.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/6.png">
      <meta name="fc:frame:button:1" content="🎩">
      </head>
      </html>
      </html>
      `);
    } else if (req.body.untrustedData.buttonIndex == 2) {
      res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>design everydays</title>
    <meta property="og:title" content="design everydays">
    <meta property="og:image" content="https://jpfraneto.github.io/images/7.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/7.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/write-reminder">
    <meta name="fc:frame:button:1" content="30 minutes">
    <meta name="fc:frame:button:2" content="2 hours">
    <meta name="fc:frame:button:3" content="5 hours">
    <meta name="fc:frame:button:4" content="12 hours">
  </head>
  </html>
  `);
    } else {
      res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>design everydays</title>
      <meta property="og:title" content="design everydays">
      <meta property="og:image" content="https://jpfraneto.github.io/images/5.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/write">
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

router.post("/write-reminder", async (req, res) => {
  try {
    console.log("inside the write reminder", req.body);
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>design everydays</title>
      <meta property="og:title" content="design everydays">
      <meta property="og:image" content="https://jpfraneto.github.io/images/5.png">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/write">
      <meta name="fc:frame" content="vNext">     
    </head>
    </html>
      </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.get("/degen", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>degen</title>
    <meta property="og:title" content="degen">
    <meta property="og:image" content="https://jpfraneto.github.io/images/degen_2.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/degen_2.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/degen">
    <meta name="fc:frame:button:1" content="read more...">
  </head>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/degen", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>degen</title>
      <meta property="og:title" content="degen">
      <meta property="og:image" content="https://jpfraneto.github.io/images/degen_tip.png">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/degen_tip.png">

      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/write">
      <meta name="fc:frame" content="vNext">     
    </head>
    </html>
      </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.get("/aua", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>frames aua</title>
    <meta property="og:title" content="frames aua">
    <meta property="og:image" content="https://jpfraneto.github.io/images/aua.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/aua.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/aua">
    <meta name="fc:frame:button:1" content="🎩">
  </head>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/aua", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>frames aua</title>
      <meta property="og:title" content="frames aua">
      <meta property="og:image" content="https://jpfraneto.github.io/images/excuse.png">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/excuse.png">

      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/aua">
      <meta name="fc:frame" content="vNext">     
    </head>
    </html>
      </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.get("/anky2", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>anky mint</title>
    <meta property="og:title" content="anky mint">
    <meta property="og:image" content="https://jpfraneto.github.io/images/farcaster-future.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/farcaster-future.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/anky">
    <meta name="fc:frame:button:1" content="mint 👽">
  </head>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/anky2", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>anky mint</title>
      <meta property="og:title" content="anky mint">
      <meta property="og:image" content="https://jpfraneto.github.io/images/farcaster-future.png">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/farcaster-future.png">

      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/anky">
      <meta name="fc:frame" content="vNext">     
    </head>
    </html>
      </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

///// MINTABLE ANKYS    /////////////////

router.get("/mintable-ankys", async (req, res) => {
  try {
    console.log("inside here, the req.query is: ", req.query.cid);
    const fullUrl = req.protocol + "://" + req.get("host");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>anky mint</title>
    <meta property="og:title" content="anky mint">
    <meta property="og:image" content="https://jpfraneto.github.io/images/reflections.png">
    <meta name="fc:frame" content="vNext">
    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/reflections.png">
    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mintable-ankys?cid=${req.query.cid}&mint=false">
    <meta name="fc:frame:button:1" content="reveal my anky 👽">
  </head>
  </html>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/mintable-ankys", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    const cid = req.query.cid;
    const anky = await prisma.generatedAnky.findUnique({ where: { cid: cid } });

    const mintable = req.query.mint;
    if (mintable && anky) {
      const fid = req.body.untrustedData.fid;
      if (Number(fid) === anky.userFid) {
        const addressFromFid = await getAddrByFid(fid);

        const ipfsRoute = `ipfs://${anky.metadataIPFSHash}`;
        const mintTx = await syndicate.transact.sendTransaction({
          projectId: "d0dd0664-198e-4615-8eb1-f0cf86dc3890",
          contractAddress: "0x5393A7d3494A1D9C8D96705966e2E35aC4FCE957",
          chainId: 8453,
          functionSignature: "mint(address to, string ipfsRoute)",
          args: {
            to: addressFromFid,
            ipfsRoute: ipfsRoute,
          },
        });
        const thisAnkyImageUrl = `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images/${anky.imagineApiID}`;
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
            <title>anky mint</title>
            <meta property="og:title" content="anky mint">
            <meta property="og:image" content="${thisAnkyImageUrl}">
            <meta name="fc:frame:image" content="${thisAnkyImageUrl}">
      
            <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mintable-ankys?cid=${req.query.cid}&mint=true">
            <meta name="fc:frame" content="vNext">     
          </head>
          </html>
          <p>YOUR ANKY WAS MINTED!</p>
            </html>
            `);
      } else {
        res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/sorry.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/sorry.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mintable-ankys?cid=${req.query.cid}&mint=false">
        <meta name="fc:frame" content="vNext">     
      </head>
      </html>
        </html>
        `);
      }
    } else {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>anky mint</title>
        <meta property="og:title" content="anky mint">
        <meta property="og:image" content="https://jpfraneto.github.io/images/error.png">
        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/error.png">
  
        <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mintable-ankys?cid=${req.query.cid}&mint=false">
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

async function getAddrByFid(fid) {
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  const resp = await fetch(options.url, { headers: options.headers });
  const responseBody = await resp.json(); // Parse the response body as JSON
  if (responseBody.users) {
    const userVerifications = responseBody.users[0];
    if (userVerifications.verifications) {
      return userVerifications.verifications[0].toString();
    }
  }
  console.log("Could not fetch user address from Neynar API for FID: ", fid);
  return "0x0000000000000000000000000000000000000000";
}

///////////// MIDJOURNEY ON A FRAME  ////////////////////////

router.get("/midjourney-on-a-frame", async (req, res) => {
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

router.post("/midjourney-on-a-frame", async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    const paso = req.query.paso;
    const userFid = req.body.untrustedData.fid;
    const thisUserAnky = await prisma.midjourneyOnAFrame.findUnique({
      where: { userFid: userFid },
    });
    console.log("this user anky", thisUserAnky);
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
    console.log("this user cast", thisUserCast);
    const moreFiltered = thisUserCast.filter(
      (x) => x.parentHash == process.env.FRAME_CAST_HASH
    );
    console.log("the more filtered is: ", moreFiltered);
    const evenMoreFiltered = moreFiltered.filter(
      (x) => Number(x.parentAuthor?.fid) === 16098
    );
    console.log("the even more filtered is:?, ev", evenMoreFiltered);
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
      console.log("in here, the this user creation is: ", thisUserAnkyCreation);
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

///// MINT - THIS - ANKY //////////

router.get("/mint-this-anky", async (req, res) => {
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

router.post("/mint-this-anky", async (req, res) => {
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
          <meta property="og:image" content="https://jpfraneto.github.io/images/one-per-person.png.png">
          <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/one-per-person.png.png">
    
          <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/mint-this-anky?midjourneyId=${midjourneyId}&revealed=1&mint=1">
          <meta name="fc:frame" content="vNext">     
        </head>
        </html>
          </html>
          `);
      }
      const addressFromFid = await getAddrByFid(userFid);
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
      return;
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
      console.log("the users anky is: ", anky);

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
        anky &&
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
