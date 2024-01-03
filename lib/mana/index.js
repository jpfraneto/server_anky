const prisma = require("../../lib/prismaClient");

async function manaGiftBetweenUsers(
  senderPrivyId,
  senderFid,
  receiverFid,
  manaAmount
) {
  try {
    const sender = await prisma.user.findUnique({
      where: { privyId: senderPrivyId },
      include: { manaBalance: true },
    });
    console.log("the sender is: ", sender);
    const receiver = await prisma.user.findUnique({
      where: { farcasterFID: receiverFid },
    });
    console.log("the receiver is: ", receiver);

    if (!sender || sender.manaBalance < manaAmount) {
      throw new Error("Sender does not have enough mana");
    }
    if (!receiver) {
      throw new Error("The recipient of the mana was not found");
    }
    // Perform the transaction
    await prisma.$transaction([
      // Subtract mana from the sender
      prisma.user.update({
        where: { privyId: senderPrivyId },
        data: { manaBalance: { decrement: manaAmount } },
      }),
      // Add mana to the receiver
      prisma.user.update({
        where: { privyId: receiver.privyId },
        data: { manaBalance: { increment: manaAmount } },
      }),
      // Record the transaction for the sender
      prisma.manaTransaction.create({
        data: {
          userId: senderPrivyId,
          amount: -manaAmount, // Negative because it's a deduction
          type: "spent",
        },
      }),
      // Record the transaction for the receiver
      prisma.manaTransaction.create({
        data: {
          userId: receiver.privyId,
          amount: manaAmount,
          type: "earned",
        },
      }),
    ]);

    return { ok: true, message: "Mana transferred successfully" };
  } catch (error) {
    console.log("Error in mana transfer:", error);
    return { ok: false, message: error.message };
  }
}

async function addManaToUser(userId, manaToAdd, cid = "") {
  try {
    if (manaToAdd < 30) return { transaction: null, streakResult: null };
    const transaction = await prisma.$transaction([
      prisma.manaTransaction.create({
        data: {
          userId,
          amount: manaToAdd,
          type: "earned",
        },
      }),
      prisma.user.update({
        where: { privyId: userId },
        data: {
          manaBalance: {
            increment: manaToAdd,
          },
          totalManaEarned: {
            increment: manaToAdd,
          },
        },
      }),
    ]);

    const streakResult = await updateStreak(userId);
    console.log("Streak updated:", streakResult.streak);

    return { transaction, streakResult }; // Returns the result of the transaction
  } catch (error) {
    console.log("there was an error adding the mana to the user:", error);
  }
}

async function spendMana(userId, manaToSpend) {
  const user = await prisma.user.findUnique({
    where: { privyId: userId },
    select: { manaBalance: true },
  });

  if (!user || user.manaBalance < manaToSpend) {
    throw new Error("Not enough mana");
  }

  const transaction = await prisma.$transaction([
    prisma.manaTransaction.create({
      data: {
        userId,
        amount: manaToSpend,
        type: "spent",
      },
    }),
    prisma.user.update({
      where: { privyId: userId },
      data: {
        manaBalance: {
          decrement: manaToSpend,
        },
      },
    }),
  ]);

  return transaction; // Returns the result of the transaction
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

async function updateStreak(privyId) {
  // Fetch the mana earning records for the user, ordered by date
  const manaRecords = await prisma.manaTransaction.findMany({
    where: {
      userId: privyId,
      type: "earned",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!manaRecords || manaRecords.length === 0) {
    return { ok: true, streak: 0 };
  }

  let dailyStreak = 1; // Start with a streak of 1

  for (let i = 1; i < manaRecords.length; i++) {
    const prevDate = new Date(manaRecords[i - 1].createdAt);
    const currDate = new Date(manaRecords[i].createdAt);

    // Set time to midnight for comparison
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    if (currDate - prevDate === MS_PER_DAY) {
      dailyStreak += 1;
    } else if (currDate - prevDate > MS_PER_DAY) {
      dailyStreak = 1; // Reset streak if there's a gap of more than one day
    }
  }

  // Update the user's streak in the database
  const user = await prisma.user.findUnique({
    where: { privyId },
    select: { longestStreak: true },
  });

  const newLongestStreak =
    user.longestStreak < dailyStreak ? dailyStreak : user.longestStreak;

  // Update the user's streak and longest streak if necessary
  await prisma.user.update({
    where: { privyId },
    data: { streak: dailyStreak, longestStreak: newLongestStreak },
  });

  return { ok: true, streak: dailyStreak, longestStreak: newLongestStreak };
}

module.exports = {
  manaGiftBetweenUsers,
  addManaToUser,
  spendMana,
  updateStreak,
};
