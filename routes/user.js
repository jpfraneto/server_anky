const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const privy = require("../lib/privyClient");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.json({ 123: 456 });
  } catch (error) {
    console.log("there was an error", error);
  }
});

router.get("/farcaster/:fid", async (req, res) => {
  try {
    console.log("inside the farcaster fid route");
    let user, manaData;
    // Find the user by privyId or farcasterFID
    user = await prisma.user.findUnique({
      where: { privyId: req.params.fid },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const manaTransactions = await prisma.manaTransaction.findMany({
      where: {
        userId: req.params.fid,
        type: "earned", // Assuming you only want to fetch 'earned' mana
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const manaByDate = manaTransactions.reduce((acc, transaction) => {
      const date = transaction.createdAt.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {});

    // The rest of your logic for the response...
    res.json({
      ankyUser: user,
      manaData: manaByDate, // Include manaData in your response if needed
    });
  } catch (error) {
    console.log("there was an error that happened querying this user", error);
    res.status(500).json({ error: error.message });
  }
});

// router.get("/farcaster/:fid", async (req, res) => {
//   try {
//     console.log("inside the farcaster fid route");
//     let user, response, manaData;
//     if (req.params.fid.length > 16) {
//       user = await prisma.user.findUnique({
//         where: { privyId: req.params.fid },
//       });
//       manaData = await prisma.mana.findMany({
//         where: { privyId: req.params.fid },
//         orderBy: {
//           earnedAt: "asc",
//         },
//       });
//       console.log("THE MANA DATA IS: ", manaData);
//     } else {
//       user = await prisma.user.findUnique({
//         where: { farcasterFID: Number(req.params.fid) },
//       });
//       manaData = await prisma.mana.findMany({
//         where: { farcasterFID: Number(req.params.fid) },
//         orderBy: {
//           earnedAt: "asc",
//         },
//       });
//       console.log("in heeeeere, the mana data is: ", manaData);
//       response = await axios.get(
//         `https://api.neynar.com/v2/farcaster/user/bulk?fids=${req.params.fid}`,
//         {
//           headers: {
//             api_key: process.env.NEYNAR_API_KEY,
//           },
//         }
//       );
//     }

//     res.json({
//       farcasterUser: response?.data?.users[0] || null,
//       ankyUser: user,
//     });
//   } catch (error) {
//     console.log("there was an error that happened querying this user", error);
//   }
// });

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
