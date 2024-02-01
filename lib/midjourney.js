const axios = require("axios");
const prisma = require("../lib/prismaClient");

const createAnkyFromPrompt = async (prompt, userFid, parentCastHash) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };
    const responseFromMidjourney = await axios.post(
      `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
      {
        prompt: `https://s.mj.run/YLJMlMJbo70 , ${prompt}`,
      },
      config
    );
    const lastCast = await axios.get(
      `https://api.neynar.com/v1/farcaster/casts?fid=${userFid}&viewerFid=18350&limit=1`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    const newGenerated = await prisma.midjourneyOnAFrame.create({
      data: {
        userFid: userFid,
        alreadyMinted: false,
        imagePrompt: prompt,
        imagineApiID: responseFromMidjourney.data.data.id,
        imagineApiStatus: "pending",
        castHash: lastCast.data.result.casts[0].hash,
      },
    });
    return responseFromMidjourney;
  } catch (error) {
    console.log("there was an error pinging the midjourney server", error);
    return null;
  }
};

module.exports = { createAnkyFromPrompt };
