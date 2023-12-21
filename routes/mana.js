const express = require("express");
const router = express.Router();
const axios = require("axios");
const { addManaToUser } = require("../lib/mana/index");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");

const activeRuns = [];

router.get("/", async (req, res) => {
  try {
    console.log("inside the mana get route");
    res.json({ 123: 456 });
  } catch (error) {
    console.log("in here in the error");
  }
});

router.post("/session-start", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    const { user, timestamp } = req.body;
    console.log("inside the server session start", user, timestamp);
    activeRuns.push({ userId: user, startingTimestamp: timestamp });
    res.status(200).json({ message: "your session started" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error starting your session " });
  }
});

router.post("/anon-session-start", async (req, res) => {
  try {
    const { randomUUID, timestamp } = req.body;
    console.log("inside the server session start", randomUUID, timestamp);
    activeRuns.push({ randomUUID: randomUUID, startingTimestamp: timestamp });
    res.status(200).json({ message: "your session started" });
  } catch (error) {
    console.log("there was an error with the anon session start", error);
    res
      .status(500)
      .json({ message: "There was an error starting your session anon" });
  }
});

router.post("/anon-session-end", async (req, res) => {
  try {
    const { randomUUID, timestamp, frontendWrittenTime } = req.body;

    const thisActiveRunIndex = activeRuns.findIndex(
      (x) => x.randomUUID == randomUUID
    );
    console.log("the active run index is: ", thisActiveRunIndex);
    const thisActiveRun = activeRuns[thisActiveRunIndex];
    const serverTimeUserWrote = Math.floor(
      (timestamp - thisActiveRun.startingTimestamp) / 1000
    );
    console.log("the time the user wrote is: ", serverTimeUserWrote);
    activeRuns.splice(thisActiveRunIndex, 1);
    const isValid = Math.abs(serverTimeUserWrote - frontendWrittenTime) < 3;

    const manaToAdd = Math.min(serverTimeUserWrote, frontendWrittenTime);
    if (isValid) {
      console.log("it is valid", serverTimeUserWrote, frontendWrittenTime);
      res.status(200).json({
        message: `If you had logged in, you would have earned ${manaToAdd} $ANKY`,
      });
    }
  } catch (error) {
    console.log("there was an error in the session end function", error);
    res
      .status(500)
      .json({ message: "There was an error in the saving the anon mana" });
  }
});

router.post("/session-end", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    const { user, timestamp, frontendWrittenTime } = req.body;
    console.log("the active runs are", activeRuns);
    console.log("the user is: ", user);
    const thisActiveRunIndex = activeRuns.findIndex((x) => x.userId == user);
    console.log("the active run index is: ", thisActiveRunIndex);
    const thisActiveRun = activeRuns[thisActiveRunIndex];
    const serverTimeUserWrote = Math.floor(
      (timestamp - thisActiveRun.startingTimestamp) / 1000
    );
    console.log("the time the user wrote is: ", serverTimeUserWrote);
    activeRuns.splice(thisActiveRunIndex, 1);
    const isValid = Math.abs(serverTimeUserWrote - frontendWrittenTime) < 3;
    const manaToAdd = Math.min(serverTimeUserWrote, frontendWrittenTime);
    if (isValid) {
      console.log("it is valid", serverTimeUserWrote, frontendWrittenTime);
      if (manaToAdd > 30) {
        const responseFromManaFunction = await addManaToUser(user, manaToAdd);
        console.log(
          "the response freom mana function is: ",
          responseFromManaFunction
        );
        res.status(200).json({
          message: `Successfully added ${manaToAdd} maná to your balance`,
        });
      } else {
        res.status(200).json({
          message: `You need to write for more than 30 seconds to earn that juicy $ANKY`,
        });
      }
    }
  } catch (error) {
    console.log("there was an error in the session end function", error);
  }
});

router.get("/:privyUID", async (req, res) => {
  try {
    console.log("inside the mana get route for the user", req.params.privyUID);
    res.json({ 123: 456 });
  } catch (error) {
    console.log("in here in the error");
  }
});

module.exports = router;
