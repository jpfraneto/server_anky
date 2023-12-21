const prisma = require("../../lib/prismaClient");

async function addManaToUser(userId, manaToAdd) {
  try {
    console.log("in here", userId);
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
  await prisma.user.update({
    where: { privyId },
    data: { streak: dailyStreak },
  });

  return { ok: true, streak: dailyStreak };
}

module.exports = { addManaToUser, spendMana, updateStreak };
