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
router.get("/fid/:fid", async (req, res) => {
  try {
    console.log("IN HERE", req.params.fid);
    const user = await prisma.user.findUnique({
      where: { farcasterFID: Number(req.params.fid) },
    });
    console.log("in here, theeee user is: ", user);
    if (user) {
      res.status(200).json({ user, success: true });
    } else {
      res.status(401).json({ user: null, success: true });
    }
  } catch (error) {
    console.log("the error is: , e", error);
    res.status(500).json({
      success: false,
      message: "There was an error fetching this user",
    });
  }
});

router.get("/farcaster/:privyId", async (req, res) => {
  try {
    console.log("inside the privyId route");
    let user, manaData;
    // Find the user by privyId or farcasterFID
    user = await prisma.user.findUnique({
      where: { privyId: req.params.privyId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const manaTransactions = await prisma.manaTransaction.findMany({
      where: {
        userId: req.params.privyId,
        type: "earned", // Assuming you only want to fetch 'earned' mana
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const highestManaTransaction = await prisma.manaTransaction.findFirst({
      where: {
        userId: req.params.privyId,
        type: "earned",
      },
      orderBy: {
        amount: "desc",
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
      longestRun: highestManaTransaction,
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

router.post("/login", async (req, res) => {
  console.log("inside the login route");
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

router.post("/:privyId", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    const privyId = req.params.privyId;
    const { thisFarcasterAccount } = req.body;
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: { farcasterAccount: true },
    });
    let updatedUser;
    if (thisFarcasterAccount) {
      const { signer_uuid, status, public_key, fid } = thisFarcasterAccount;

      const existingFarcasterAccount = await prisma.farcasterAccount.findUnique(
        {
          where: { userId: privyId },
        }
      );
      console.log(
        "the existing farcaster account is: ",
        existingFarcasterAccount
      );
      if (existingFarcasterAccount) {
        await prisma.farcasterAccount.update({
          where: { id: existingFarcasterAccount.id },
          data: {
            signerUuid: signer_uuid,
            publicKey: public_key,
            signerStatus: status,
            fid: fid || 0,
          },
        });
        updatedUser = await prisma.user.update({
          where: { privyId },
          data: {
            farcasterFID: fid,
          },
        });
        console.log(
          "the farcaster account was UPDATED with the new signer status"
        );
      } else {
        await prisma.farcasterAccount.create({
          data: {
            user: { connect: { privyId: privyId } },
            publicKey: public_key,
            signerUuid: signer_uuid,
            signerStatus: status,
            fid: fid || 0,
          },
        });
        updatedUser = await prisma.user.update({
          where: { privyId },
          data: {
            farcasterFID: fid,
          },
        });
        console.log(
          "the farcaster account was CREATED with the new signer status"
        );
      }
    }

    console.log("the user is: ", user, updatedUser);
    res.json({ user });
  } catch (error) {
    console.log("there was an error", error);
  }
});

module.exports = router;
