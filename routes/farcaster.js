const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const { NeynarAPIClient, CastParamType } = require("@neynar/nodejs-sdk");

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
  console.log("the farcaster developer mnemonic", FARCASTER_DEVELOPER_MNEMONIC);
  console.log(
    "the farcaster developer mnemonic",
    typeof FARCASTER_DEVELOPER_MNEMONIC
  );

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);

  // Generates an expiration date for the signature
  // e.g. 1693927665
  // const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now
  const deadline = 1702675646;
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

router.post("/api/signer", async (req, res) => {
  try {
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

    res.json(signedKeyResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/signer", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.neynar.com/v2/farcaster/signer",
      {
        params: req.query,
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("there was an error inside here!");
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/cast/anon", async (req, res) => {
  const { text, parent, embeds } = req.body;
  try {
    console.log("sending the cast from the backend");
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
    let secondCastText = `welcome to a limitless era of farcaster`;
    console.log("IN HERE, THE PUBLISHED CAST IS: ", response);
    if (!response.status)
      return res.status(500).json({ message: "there was a problem here" });
    const secondResponse = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: secondCastText,
        embeds: [{ url: `https://www.anky.lat/r/${response.data.cast.hash}` }],
        signer_uuid: process.env.MFGA_SIGNER_UUID,
        parent: response.data.cast.hash,
      },
      {
        headers: {
          api_key: process.env.MFGA_API_KEY,
        },
      }
    );
    console.log("in here, the second response is: ", secondResponse);
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
    console.log("IN HERE, THE PUBLISHED CAST IS: ", response);
    res.json({ cast: publishedCast });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/cast/:hash", async (req, res) => {
  console.log("IN HERE", req);
  try {
    console.log("router.params.hash", req.params.hash);
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

router.post("/api/cast", async (req, res) => {
  const { embeds, text, signer_uuid, parent } = req.body;
  try {
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: text,
        embeds: embeds,
        signer_uuid: signer_uuid,
        parent: parent,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/test", async (req, res) => {
  try {
    console.log("in the test route");
    // const signerUuid = process.env.MFGA_SIGNER_UUID;
    // const client = new NeynarAPIClient(process.env.MFGA_API_KEY);
    // const publishedCast = await client.clients.v2.publishCast(
    //   signerUuid,
    //   "This is a test cast."
    // );
    // console.log(`New cast hash: ${publishedCast.hash}`);
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      {
        text: "aloja",
        embeds: [],
        signer_uuid: process.env.MFGA_SIGNER_UUID,
        parent: "https://warpcast.com/~/channel/anky",
      },
      {
        headers: {
          api_key: process.env.MFGA_API_KEY,
        },
      }
    );
    console.log("in the test route, the post is: ", response);
  } catch (error) {
    console.log("there was an error", error);
  }
});

router.get("/neynar", async (req, res) => {
  try {
    // console.log("testing route");
    // const response = await axios.post(
    //   "https://api.neynar.com/v2/farcaster/cast",
    //   {
    //     text: "aloja"",
    //     embeds: [],
    //     signer_uuid: signer_uuid,
    //     parent: parent,
    //   },
    //   {
    //     headers: {
    //       api_key: process.env.NEYNAR_API_KEY,
    //     },
    //   }
    // );
  } catch (error) {}
});

module.exports = router;
