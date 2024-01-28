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

router.post("/toggle-notifications", async (req, res) => {
  const { userId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { privyId: userId },
      data: { farcasterNotificationsEnabled: true },
    });

    res.json({ message: "Notification setting updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating notification setting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/fid/:fid", async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: { farcasterFID: Number(req.params.fid) },
    });
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

router.get("/farcaster-feed/:fid", async (req, res) => {
  try {
    const fidToQuery = Number(req.params.fid);
    if (!fidToQuery)
      return res.status(401).json({ message: "there was an error here" });
    const viewerFid = 18350;
    const limit = 25;
    const userResponse = await axios.get(
      `https://api.neynar.com/v1/farcaster/user?fid=${fidToQuery}&viewerFid=${18350}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    const response = await axios.get(
      `https://api.neynar.com/v1/farcaster/casts?fid=${fidToQuery}&viewerFid=${viewerFid}&limit=${limit}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    res.status(200).json({
      user: userResponse.data.result.user,
      feed: response.data.result.casts,
    });
  } catch (error) {
    console.log("there was an error fetching the feed");
    res.status(500).json({ message: "There was an error" });
  }
});

router.get("/farcaster/:privyId", async (req, res) => {
  try {
    let user, manaData;
    // Find the user by privyId or farcasterFID
    user = await prisma.user.findUnique({
      where: { privyId: req.params.privyId },
      include: {
        farcasterAccount: {
          select: {
            id: false, // Why would a third party want to know the id?
            username: true,
            displayName: true,
            bio: true,
            pfp: true,
            signerStatus: true,
            fid: true,
          },
        },
      },
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

router.post("/login", async (req, res) => {
  try {
    const { privyId } = req.body; // Ensure you are receiving the correct fields from the frontend

    const privyUser = await privy.getUser(`did:privy:${privyId}`);
    if (!privyUser)
      return res.status(500).json({ message: "You are not authorized here" });

    let user = await prisma.user.findUnique({
      where: { privyId },
      include: {
        farcasterAccount: {
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            pfp: true,
            signerStatus: true,
            fid: true,
            // signerUuid: false, // Not needed, omitted fields are excluded by default
            // publicKey: false, // Not needed, omitted fields are excluded by default
          },
        },
      },
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
    let existingFarcasterAccount;
    const privyId = req.params.privyId;
    const { thisFarcasterAccount } = req.body;
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: { farcasterAccount: true },
    });
    if (thisFarcasterAccount) {
      const {
        signer_uuid,
        status,
        public_key,
        fid,
        pfp,
        username,
        displayName,
      } = thisFarcasterAccount;
      const bio = thisFarcasterAccount?.bio?.text || "";

      existingFarcasterAccount = await prisma.farcasterAccount.findUnique({
        where: { userId: privyId },
      });

      if (existingFarcasterAccount && fid) {
        await prisma.farcasterAccount.update({
          where: { id: existingFarcasterAccount.id },
          data: {
            signerUuid: signer_uuid,
            publicKey: public_key,
            signerStatus: status,
            fid: fid,
            bio,
            pfp,
            username,
            displayName,
          },
        });
        updatedUser = await prisma.user.update({
          where: { privyId },
          data: {
            farcasterFID: fid,
          },
        });
      } else {
        let newUser;
        if (!user) {
          newUser = await prisma.user.create({
            data: {
              privyId,
            },
          });
        }
        if (fid) {
          await prisma.farcasterAccount.create({
            data: {
              user: { connect: { privyId: privyId } },
              publicKey: public_key,
              signerUuid: signer_uuid,
              signerStatus: status,
              fid: fid,
              bio,
              pfp,
              username,
            },
          });
          updatedUser = await prisma.user.update({
            where: { privyId },
            data: {
              farcasterFID: fid,
            },
          });
        }
      }
    } else {
      if (user.farcasterAccount) {
        existingFarcasterAccount = user.farcasterAccount;
      }
    }

    res.json({ user, farcasterAccount: existingFarcasterAccount });
  } catch (error) {
    console.log("there was an error", error);
  }
});

module.exports = router;
