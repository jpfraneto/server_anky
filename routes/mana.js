const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const { addManaToUser } = require("../lib/mana/index");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");

let activeRuns = [];

router.post("/session-start", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    const { user, timestamp } = req.body;
    console.log("inside the server session start", user, timestamp);
    const filteredActiveRuns = activeRuns.filter((x) => x.userId != user);
    activeRuns = filteredActiveRuns;
    activeRuns.push({ userId: user, startingTimestamp: timestamp });
    console.log("in here, the active runs are now: ", activeRuns);
    res.status(200).json({ message: "your session started" });
  } catch (error) {
    console.log("there was an error here", error);
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
    console.log("there was an error with the anon session start");
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
        let cid = ""; // THIS HAS TO BE UPDATED ONE DAY TO CAPTURE THE IRYS CID ON THE FRONTEND AND ADD IT HERE FOR REFERENCE
        const responseFromManaFunction = await addManaToUser(
          user,
          manaToAdd,
          cid
        );
        console.log(
          "the response freom mana function is: ",
          responseFromManaFunction
        );
        res.status(200).json({
          message: `Successfully added ${manaToAdd} $NEWEN to your balance`,
          data: {
            activeStreak: responseFromManaFunction.streakResult.streak,
            manaBalance: responseFromManaFunction.transaction[1].manaBalance,
          },
        });
      } else {
        res.status(200).json({
          message: `You need to write for more than 30 seconds to earn that juicy $ANKY`,
        });
      }
    }
  } catch (error) {}
});

router.get("/:privyUID", async (req, res) => {
  try {
    console.log("inside the mana get route for the user", req.params.privyUID);
    res.json({ 123: 456 });
  } catch (error) {
    console.log("in here in the error");
  }
});

router.get("/leaderboard/:category", async (req, res) => {
  try {
    let leaderboard;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (req.params.category) {
      case "all-time":
        leaderboard = await prisma.manaTransaction.groupBy({
          by: ["userId"],
          _sum: {
            amount: true,
          },
          where: {
            type: "earned",
          },
          orderBy: {
            _sum: {
              amount: "desc",
            },
          },
        });
        res.status(200).json(leaderboard);
        break;
      case "today":
        leaderboard = await prisma.manaTransaction.groupBy({
          by: ["userId"],
          _sum: {
            amount: true,
          },
          where: {
            AND: [
              { type: "earned" },
              {
                createdAt: {
                  gte: today,
                  lt: new Date(today.valueOf() + 24 * 60 * 60 * 1000), // Less than the start of the next day
                },
              },
            ],
          },
          orderBy: {
            _sum: {
              amount: "desc",
            },
          },
        });
        res.status(200).json(leaderboard);
        break;
      case "longest-runs":
        const longestRuns = await prisma.manaTransaction.findMany({
          where: { type: "earned" },
          orderBy: { amount: "desc" },
          take: 20,
          include: { user: true }, // Include user details in the result
        });

        res.status(200).json(
          longestRuns.map((run) => ({
            userId: run.user.privyId, // or username if it's available
            amount: run.amount,
            // Include other user details as needed
          }))
        );
        break;

      default:
        res.status(400).json({ message: "Invalid category" });
        break;
    }
  } catch (error) {
    console.log(
      "there was an error getting the leaderboard information",
      error
    );
    res.status(500).json({
      message: "There was an error getting the leaderboard information",
    });
  }
});

module.exports = router;
