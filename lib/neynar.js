const axios = require("axios");

const getCastFromNeynar = async (threadHash, viewerFid) => {
  try {
    const response = await axios.get(
      `https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=${threadHash}&viewerFid=${viewerFid}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("there was an error getting the cast from neynar", error);
    return null;
  }
};

module.exports = { getCastFromNeynar };
