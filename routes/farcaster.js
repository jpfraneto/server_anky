const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getCastsByFid } = require("../lib/blockchain/farcaster");
const { mnemonicToAccount } = require("viem/accounts");
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

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);

  // Generates an expiration date for the signature
  // e.g. 1693927665
  const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now
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
    console.log(
      "before the call to the signed key",
      FARCASTER_DEVELOPER_FID,
      createSignerResponse.data,
      deadline,
      signature
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

    console.log("after the generate signer signas", signedKeyResponse);

    res.json(signedKeyResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/signer", async (req, res) => {
  try {
    console.log("inside the api signer route", req.query);
    const response = await axios.get(
      "https://api.neynar.com/v2/farcaster/signer",
      {
        params: req.query,
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    console.log(
      "inside the api signer route, the response is: ",
      response.data
    );
    res.json(response.data);
  } catch (error) {
    console.log("there was an error inside here!");
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

router.get("/neynar", async (req, res) => {
  try {
    console.log("inside the neynar route");
    const response = await getCastsByFid(1234);
    res.json(response);
  } catch (error) {}
});

module.exports = router;
