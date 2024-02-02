const express = require("express");
const router = express.Router();

const midjourneyOnAFrame = require("./midjourney-on-a-frame");
const ankyOnAFrame = require("./anky-on-a-frame");
const mintThisAnky = require("./mint-this-anky");
const hasntMintedYet = require("./hasnt-minted-yet");
const cryptoTheGame = require("./cyrpto-the-game");

router.use("/midjourney-on-a-frame", midjourneyOnAFrame);
router.use("/anky-on-a-frame", ankyOnAFrame);
router.use("/mint-this-anky", mintThisAnky);
router.use("/hasnt-minted-yet", hasntMintedYet);
router.use("/crypto-the-game", cryptoTheGame);

module.exports = router;
