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

    console.log("the response from midjourney is: ", responseFromMidjourney);
    const newGenerated = await prisma.midjourneyOnAFrame.create({
      data: {
        userFid: userFid,
        alreadyMinted: false,
        imagePrompt: prompt,
        imagineApiID: responseFromMidjourney.data.data.id,
        imagineApiStatus: "pending",
        castHash: parentCastHash,
      },
    });
    console.log("the new generated is:", newGenerated);
    return responseFromMidjourney;
  } catch (error) {
    console.log("there was an error pinging the midjourney server", error);
    return null;
  }
};

module.exports = { createAnkyFromPrompt };
