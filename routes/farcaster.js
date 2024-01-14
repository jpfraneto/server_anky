const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");

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

  // Generates an expiration date for the signature
  // e.g. 1693927665
  const deadline = Math.floor(Date.now() / 1000) + 3 * 86400; // signature is valid for 3 days from now
  // const deadline = 1702675646;
  // You should pass the same value generated here into the POST /signer/signed-key Neynar API

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

  // Logging the deadline and signature to be used in the POST /signer/signed-key Neynar API
  return { deadline, signature };
};

router.get("/feed", async (req, res) => {
  try {
    const memesChannelUrl = "https://warpcast.com/~/channel/anky";
    const feed = await client.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      parentUrl: memesChannelUrl,
    });

    res.status(200).json({ feed });
  } catch (error) {
    console.log("there was an error on the feed here");
  }
});

router.post("/api/signer", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    const { privyId } = req.body;
    const createSignerResponse = await axios.post(
      "https://api.neynar.com/v2/farcaster/signer",
      {},
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    const { deadline, signature } = await generate_signature(
      createSignerResponse.data.public_key
    );

    const signedKeyResponse = await axios.post(
      "https://api.neynar.com/v2/farcaster/signer/signed_key",
      {
        signer_uuid: createSignerResponse.data.signer_uuid,
        app_fid: FARCASTER_DEVELOPER_FID,
        deadline,
        signature,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    console.log("IN HEEEERE", signedKeyResponse);
    const { public_key, signer_uuid, status } = signedKeyResponse.data;
    const existingFarcasterAccount = await prisma.farcasterAccount.findUnique({
      where: { userId: privyId },
    });
    console.log("IN HEEERE", existingFarcasterAccount);
    if (existingFarcasterAccount) {
      await prisma.farcasterAccount.update({
        where: { id: existingFarcasterAccount.id },
        data: {
          publicKey: public_key,
          signerUuid: signer_uuid,
          signerStatus: status,
        },
      });
      console.log("the farcaster account was updated");
    } else {
      await prisma.farcasterAccount.create({
        data: {
          user: { connect: { privyId: privyId } },
          publicKey: public_key,
          signerUuid: signer_uuid,
          signerStatus: status,
        },
      });
      console.log("the farcaster account was created");
    }

    // Respond with the signed key response data
    res.json(signedKeyResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/signer", async (req, res) => {
  const { signer_uuid, privyId } = req.query;
  try {
    console.log("before theraoñ get api signer", signer_uuid);
    const response = await axios.get(
      "https://api.neynar.com/v2/farcaster/signer",
      {
        params: {
          signer_uuid,
        },
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    console.log("the response is: ", response.data);
    if (response.data.status == "approved") {
      const existingFarcasterAccount = await prisma.farcasterAccount.findUnique(
        {
          where: { userId: privyId },
        }
      );
      if (existingFarcasterAccount) {
        await prisma.farcasterAccount.update({
          where: { id: existingFarcasterAccount.id },
          data: {
            signerStatus: response.data.status,
          },
        });
        console.log(
          "the farcaster account was updated with the new signer status"
        );
      }
    }
    res.json(response.data);
  } catch (error) {
    console.log("there was an error inside here!");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/u/:fid", async (req, res) => {
  try {
    const response = await client.lookupUserByFid(req.params.fid);
    res.status(200).json({ user: response.result.user });
  } catch (error) {
    console.log("there was an error here");
  }
});

router.get("/u/:fid/feed", async (req, res) => {
  try {
    console.log("in here", req.params.fid);
    if (typeof req.params.fid == "number") {
      const response = await axios.get(
        `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${req.params.fid}&limit=50`,
        {
          headers: {
            api_key: process.env.NEYNAR_API_KEY,
          },
        }
      );
      res.status(200).json({ casts: response.data.casts });
    } else {
      res.status(200).json({ casts: null });
    }
  } catch (error) {
    console.log("there was an error fetching the feed");
  }
});

router.get("/anky-channel-feed", async (req, res) => {
  try {
    const ankyChannelUrl = "https://warpcast.com/~/channel/anky";

    const feed = await client.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      parentUrl: ankyChannelUrl,
    });
    console.log("the feed for the anky client is: ", feed);
    res.status(200).json({ feed });
  } catch (error) {
    console.log("there was an error getting the anky feed");
    res
      .status(500)
      .json({ message: "there was an error loading the anky feed" });
  }
});

router.post("/u/:fid/feed", async (req, res) => {
  try {
    console.log("getting the feed");
    const { viewerFid } = req.body;
    const ankyChannelUrl = "https://warpcast.com/~/channel/anky";
    const usersFid = req.params.fid;

    // const response = await axios.get(
    //   `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${usersFid}&with_recasts=true&limit=25`,
    //   {
    //     headers: {
    //       api_key: process.env.NEYNAR_API_KEY,
    //     },
    //   }
    // );

    const result = await client.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      parentUrl: ankyChannelUrl,
      limit: 20,
      fid: usersFid,
    });
    console.log("IN HERE, THE RESULT IS: ", result);

    res.status(200).json({ feed: response.data.casts });
  } catch (error) {
    console.log("there was an error here", error);
  }
});

router.get("/get-feed/:collectionId", async (req, res) => {
  try {
    const addrs = await getAddressesThatOwnNFT(req.params.collectionId);

    const usersLookup = async (addrs) => {
      const users = await Promise.all(
        addrs.map(async (addr) => {
          try {
            const response = await client.lookupUserByVerification(addr);
            return response ? response.result.user : undefined;
          } catch (error) {
            return undefined;
          }
        })
      );
      return users.filter((fid) => fid !== undefined);
    };

    const usersThatOwnThisNft = await usersLookup(addrs);

    res.status(200).json({ users: usersThatOwnThisNft });
  } catch (error) {
    console.log("there was an error getting the random feed", error);
  }
});

const getAddressesThatOwnNFT = async (address) => {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
    const url = `${baseUrl}contractAddress=${address}&withTokenBalances=false`;

    const result = await fetch(url, {
      headers: { accept: "application/json" },
    });
    const data = await result.json();
    return data.owners;
  } catch (error) {
    console.log(
      "there was an error fetching the addresses that own that nft",
      error
    );
  }
};

router.post("/api/reaction", async (req, res) => {
  try {
    const { reactionType, hash, signer_uuid } = req.body;

    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/reaction",
      {
        signer_uuid: signer_uuid,
        reaction_type: reactionType,
        target: hash,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log("there was an error", error);
    res.status(500).json({ message: "there was an error adding the reaction" });
  }
});

router.post("/api/cast/anon", async (req, res) => {
  const { text, parent, embeds } = req.body;
  console.log("the text, parent and embeds are: ", text, parent, embeds);
  try {
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: text,
        embeds: embeds,
        signer_uuid: process.env.MFGA_SIGNER_UUID,
        parent: "https://warpcast.com/~/channel/anky",
      },
      {
        headers: {
          api_key: process.env.MFGA_API_KEY,
        },
      }
    );
    console.log("the cast was published on farcaster: ", response.data);
    let secondCastText = `welcome to a limitless era of farcaster`;
    if (!response.status)
      return res.status(500).json({ message: "there was a problem here" });
    // const secondResponse = await axios.post(
    //   "https://api.neynar.com/v2/farcaster/cast",
    //   {
    //     text: secondCastText,
    //     embeds: [{ url: `https://www.anky.lat/r/${response.data.cast.hash}` }],
    //     signer_uuid: process.env.MFGA_SIGNER_UUID,
    //     parent: response.data.cast.hash,
    //   },
    //   {
    //     headers: {
    //       api_key: process.env.MFGA_API_KEY,
    //     },
    //   }
    // );
    res.json({ cast: response.data.cast });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/cast/anon-reply", async (req, res) => {
  const { text, parent } = req.body;
  try {
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: text,
        embeds: embeds,
        signer_uuid: process.env.MFGA_SIGNER_UUID,
        parent: parent,
      },
      {
        headers: {
          api_key: process.env.MFGA_API_KEY,
        },
      }
    );
    res.json({ cast: publishedCast });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/cast/replies/:hash", async (req, res) => {
  const { viewerFid, threadHash } = req.body;
  try {
    // const cast = await client.lookUpCastByHashOrWarpcastUrl(
    //   router.params.hash,
    //   CastParamType.Hash
    // );
    const response = await axios.get(
      `https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=${threadHash}&viewerFid=${viewerFid}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    res.json({ casts: response.data.result.casts });
  } catch (error) {
    console.log("there was an error)");
    console.log(error);
    res.json({ cast: null });
  }
});

router.get("/api/cast/:hash", async (req, res) => {
  try {
    // const cast = await client.lookUpCastByHashOrWarpcastUrl(
    //   router.params.hash,
    //   CastParamType.Hash
    // );
    const response = await axios.get(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        params: {
          identifier: req.params.hash,
          type: "hash",
        },
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    console.log("the repsonse is: ", response);
    res.json({ cast: response.data.cast });
  } catch (error) {
    console.log("there was an error)");
    console.log(error);
    res.json({ cast: null });
  }
});

async function getFullCastFromWarpcasterUrl(url) {
  try {
    const apiRoute = `https://api.neynar.com/v2/farcaster/cast?identifier=${url.replace(
      "/",
      "%2F"
    )}&type=url`;
    const response = await axios.get(apiRoute, {
      headers: {
        api_key: process.env.NEYNAR_API_KEY,
      },
    });
    return response.data.cast;
  } catch (error) {
    console.log("there was an error ");
  }
}

router.post("/api/cast", async (req, res) => {
  const { embeds, text, signer_uuid, parent } = req.body;
  // Parent is on this format: { parent: 'https://warpcast.com/jpfraneto/0xa7c31262' }
  const fullCast = await getFullCastFromWarpcasterUrl(parent.parent);
  try {
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: text,
        embeds: embeds,
        signer_uuid: signer_uuid,
        parent: fullCast.hash,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    console.log("after casting the cast");
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/all-casts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.neynar.com/v1/farcaster/recent-casts?viewerFid=3&limit=25",
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    res.status(200).json({ casts: response.data.result.casts });
    console.log("the response from the server is: ", response);
  } catch (error) {
    console.log("there was an error here");
    res.status(500).json({ success: false, message: "There was an error" });
  }
});

module.exports = router;
