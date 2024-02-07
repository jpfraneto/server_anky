const express = require("express");
const router = express.Router();

const midjourneyOnAFrame = require("./midjourney-on-a-frame");
const ankyOnAFrame = require("./anky-on-a-frame");
const mintThisAnky = require("./mint-this-anky");
const hasntMintedYet = require("./hasnt-minted-yet");
const cryptoTheGame = require("./cyrpto-the-game");
const redirecter = require("./redirecter");
const generatedAnky = require("./generated-anky");
const humanMusic = require("./human-music");
const electronicMusic = require("./electronic-music");

router.use("/midjourney-on-a-frame", midjourneyOnAFrame);
router.use("/anky-on-a-frame", ankyOnAFrame);
router.use("/redirecter", redirecter);
router.use("/generated-anky", generatedAnky);
router.use("/mint-this-anky", mintThisAnky);
router.use("/hasnt-minted-yet", hasntMintedYet);
router.use("/crypto-the-game", cryptoTheGame);
router.use("/human-music", humanMusic);
router.use("/electronic-music", electronicMusic);

module.exports = router;
