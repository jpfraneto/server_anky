const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const privy = require("../lib/privyClient");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    console.log("the users are: ", users);
    res.json({ 123: 456 });
  } catch (error) {
    console.log("there was an error", error);
  }
});

router.get("/:privyId", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    console.log("checking the user here:", req.params.privyId);
    const user = await prisma.user.findUnique({
      where: { privyId: req.params.privyId },
    });
    console.log("the user is: ", user);
    res.json({ user });
  } catch (error) {
    console.log("there was an error", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { privyId } = req.body; // Ensure you are receiving the correct fields from the frontend

    const privyUser = await privy.getUser(`did:privy:${privyId}`);
    if (!privyUser)
      return res.status(500).json({ message: "You are not authorized here" });

    let user = await prisma.user.findUnique({
      where: { privyId },
    });

    if (!user) {
      // If not, create a new user
      user = await prisma.user.create({
        data: {
          privyId,
        },
      });
    } else {
      // If yes, update the last login time
      user = await prisma.user.update({
        where: { privyId },
        data: {
          lastLogin: new Date(),
        },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error handling user login:", error);
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
});

module.exports = router;
