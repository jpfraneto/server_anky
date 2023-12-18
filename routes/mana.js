const express = require("express");
const router = express.Router();
const axios = require("axios");
const { addManaToUser } = require("../lib/mana/index");

const activeRuns = [];

router.get("/", async (req, res) => {
  try {
    console.log("inside the mana get route");
    res.json({ 123: 456 });
  } catch (error) {
    console.log("in here in the error");
  }
});

router.post("/session-start", async (req, res) => {
  try {
    const { user, timestamp } = req.body;
    console.log("inside the server session start", user, timestamp);
    activeRuns.push({ userId: user, startingTimestamp: timestamp });
  } catch (error) {}
});

router.post("/session-end", async (req, res) => {
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
    if (isValid) {
      console.log("it is valid", serverTimeUserWrote, frontendWrittenTime);
      const responseFromManaFunction = await addManaToUser(
        user,
        Math.min(serverTimeUserWrote, frontendWrittenTime)
      );
    }

    console.log("inside the server session end", user, timestamp);
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
