const cron = require("node-cron");
const prisma = require("./prismaClient");
const axios = require("axios");

const MS_PER_DAY = 24 * 60 * 60 * 1000; // Milliseconds in a day

// Schedule reminders for three times a day
function scheduleReminders() {
  cron.schedule("0 0 * * *", () => checkAndSendReminders("endOfDay")); // At the end of the day
  cron.schedule("0 12 * * *", () => checkAndSendReminders("midDay")); // In the middle of the day
  cron.schedule("0 19 * * *", () => checkAndSendReminders("preEndOfDay")); // 5 hours before the day ends
}

async function checkAndSendReminders(timeOfDay) {
  const now = new Date();

  // Get all users with enabled notifications
  const users = await prisma.user.findMany({
    where: {
      farcasterNotificationsEnabled: true,
    },
    include: {
      farcasterAccount: true,
      streak: true,
      ManaTransaction: {
        where: {
          type: "earned",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  const delayBetweenCasts = 555; // in milliseconds, adjust as needed

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const lastTransaction = user.ManaTransaction[0];
    const lastTransactionDate = lastTransaction
      ? new Date(lastTransaction.createdAt)
      : new Date(0); // Epoch if no transaction
    lastTransactionDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const hasWrittenToday = lastTransactionDate.getTime() === now.getTime();

    // If the user hasn't written today, schedule a reminder
    if (!hasWrittenToday) {
      setTimeout(async () => {
        // Craft the reminder message including the user's streak
        const message = `Hello ${user.farcasterAccount.username}, don't forget to write on Anky today to maintain your streak of ${user.streak} days.\n\n Aim for 480 seconds of full focus.`;

        // Send a "cast" on Farcaster using the existing route or logic
        await sendCast(message, user.farcasterAccount.fid);
      }, i * delayBetweenCasts);
    }
  }
}

async function fetchRandomCast(fid) {
  try {
    const castsResponse = await axios.get(
      `https://api.neynar.com/v1/farcaster/casts?fid=${fid}&viewerFid=18350&limit=25`,
      {
        headers: {
          api_key: process.env.MFGA_API_KEY,
        },
      }
    );

    // Choose a random cast from the fetched list
    const casts = castsResponse.data.result.casts;
    const randomCast = casts[Math.floor(Math.random() * casts.length)];
    return randomCast;
  } catch (error) {
    console.log("there was an error fetching the random cast", error);
  }
}

async function sendCast(message, fid) {
  try {
    const randomCast = await fetchRandomCast(fid);
    if (randomCast) {
      const embeds = [
        {
          type: "website",
          url: `https://www.anky.lat/write`,
        },
      ];
      const response = await axios.post(
        "https://api.neynar.com/v2/farcaster/cast",
        {
          text: message,
          embeds: embeds,
          signer_uuid: process.env.MFGA_SIGNER_UUID,
          parent: randomCast.hash,
        },
        {
          headers: {
            api_key: process.env.MFGA_API_KEY,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error sending cast:", error);
    // You might want to handle the error, e.g., retry or log it to a monitoring service
  }
}

module.exports = {
  scheduleReminders,
  sendCast,
};
