const express = require("express");
const router = express.Router();
const axios = require("axios");
const { prisma } = require("../lib/prismaClient");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");

router.post("/login", async (req, res) => {
  try {
    const { privyId } = req.body; // Ensure you are receiving the correct fields from the frontend
    console.log("inside here, the privy IDDDDD is: ", privyId);
    console.log("prisma is: ", prisma);
    return res.status(200).json({ 123: 446 });
    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { privyId },
    });

    if (!user) {
      // If not, create a new user
      user = await prisma.user.create({
        data: {
          privyId,
          email,
          // Include any other fields you want to initialize
        },
      });
    } else {
      // If yes, update the last login time
      user = await prisma.user.update({
        where: { privyId },
        data: {
          lastLogin: new Date(),
          // Update other fields if necessary
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
