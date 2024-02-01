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

async function getAddrByFid(fid) {
  try {
    const options = {
      method: "GET",
      url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY || "",
      },
    };
    const resp = await fetch(options.url, { headers: options.headers });
    const responseBody = await resp.json(); // Parse the response body as JSON
    if (responseBody.users) {
      const userVerifications = responseBody.users[0];
      if (userVerifications.verifications) {
        return userVerifications.verifications[0].toString();
      }
    }
    console.log("Could not fetch user address from Neynar API for FID: ", fid);
    return "0x0000000000000000000000000000000000000000";
  } catch (error) {
    console.log("there was an error retrieving the wallet");
  }
}

module.exports = { getCastFromNeynar, getAddrByFid };
