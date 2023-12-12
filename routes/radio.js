const express = require("express");
const router = express.Router();
const axios = require("axios");
const { NeynarAPIClient, CastParamType } = require("@neynar/nodejs-sdk");

router.post("/music", async (req, res) => {
  try {
    console.log("hello world");
  } catch (error) {}
});

module.exports = router;
