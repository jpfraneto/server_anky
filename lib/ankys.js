require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const fs = require("fs");
const { v2 } = require("cloudinary");

const FormData = require("form-data");

const {
  uploadMetadataToPinata,
  uploadImageToPinata,
  uploadToPinataFromUrl,
} = require("../lib/pinataSetup");
const {
  NeynarAPIClient,
  CastParamType,
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk");
const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const checkAndUpdateAnkys = async () => {
  const ankys = await prisma.generatedAnky.findMany({
    where: {
      OR: [
        { imagineApiStatus: "pending" },
        { imagineApiStatus: "in-progress" },
        { imagineApiStatus: "failed" },
      ],
    },
  });

  for (const anky of ankys) {
    try {
      const response = await axios.get(
        `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images/${anky.imagineApiID}`,
        {
          headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
        }
      );
      const apiData = response.data.data;
      if (apiData.status === "completed") {
        // Assuming uploadImageToPinata function takes buffer and returns IPFS hash
        const randomUpscaledId =
          apiData.upscaled[Math.floor(Math.random() * apiData.upscaled.length)];
        const thisImageUrl = `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/assets/${randomUpscaledId}/${randomUpscaledId}.png`;

        const imageBuffer = await axios
          .get(thisImageUrl, { responseType: "arraybuffer" })
          .then((res) => res.data);
        const ipfsHash = await uploadImageToPinata(imageBuffer, anky.cid);
        if (!ipfsHash) return;
        const nftMetadata = {
          name: "you",
          description: anky.ankyBio,
          image: `ipfs://${ipfsHash}`,
        };
        const ipfsMetadataHash = await uploadMetadataToPinata(nftMetadata);
        if (!ipfsMetadataHash) return;

        await prisma.generatedAnky.update({
          where: { cid: anky.cid },
          data: {
            imagineApiStatus: apiData.status,
            imageIPFSHash: ipfsHash,
            metadataIPFSHash: ipfsMetadataHash,
          },
        });
        // NOW IT IS TIME TO CREATE THE NFT. WORK HERE:

        const cast = `your anky is ready to be minted.\n\n here... yes, here.`;
        let castOptions = {
          parent: `https://warpcast.com/~/channel/anky`,
          text: cast,
          embeds: [
            {
              url: `https://api.anky.lat/farcaster-frames/mintable-ankys?cid=${anky.cid}`,
            },
          ],
          signer_uuid: process.env.MFGA_SIGNER_UUID,
        };
        const response = await axios.post(
          "https://api.neynar.com/v2/farcaster/cast",
          castOptions,
          {
            headers: {
              api_key: process.env.MFGA_API_KEY,
            },
          }
        );
        await prisma.generatedAnky.update({
          where: { cid: anky.cid },
          data: {
            castHash: response.data.cast.hash,
          },
        });
      } else if (apiData.status === "failed") {
        await createImageAgain(anky);
      } else {
        await prisma.generatedAnky.update({
          where: { cid: anky.cid },
          data: { imagineApiStatus: apiData.status },
        });
      }
    } catch (error) {
      console.error(
        `Error updating GeneratedAnky with cid ${anky.cid}: `,
        error?.response?.data?.errors || error
      );
    }
  }
};

const uploadToCloudinary = (filePath, id) => {
  return new Promise((resolve, reject) => {
    const streamUpload = v2.uploader.upload_stream(
      {
        public_id: id, // optional, remove if not needed
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    // Create a read stream from the file and pipe it to the Cloudinary upload_stream
    fs.createReadStream(filePath).pipe(streamUpload);
  });
};

const checkAndUpdateMidjourneyOnAFrameAnkys = async () => {
  // console.log("the usersa anky is: ", ankys);
  // const ankys = await prisma.midjourneyOnAFrame.findMany({
  //   where: {
  //     OR: [
  //       { imagineApiStatus: "pending" },
  //       { imagineApiStatus: "in-progress" },
  //       { imagineApiStatus: "failed" },
  //     ],
  //   },
  // });
  const thisAnky = await prisma.midjourneyOnAFrame.findUnique({
    where: { userFid: 2526 },
  });
  console.log("this anky is: ", thisAnky);
  const ankys = [thisAnky];
  // return;
  console.log("there are X ankys remaining", ankys.length);
  function delay(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  for (const anky of ankys) {
    try {
      console.log("checking this anky", anky);
      await delay(1111);
      if (anky.alreadyMinted && anky.metadataIPFSHash) return null;
      const response = await axios.get(
        `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images/${anky.imagineApiID}`,
        {
          headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
        }
      );
      const apiData = response.data.data;
      console.log("the api data is: ", apiData);
      if (apiData.status === "completed") {
        const userResponse = await neynarClient.lookupUserByFid(anky.userFid);

        const randomUpscaledId =
          apiData.upscaled[Math.floor(Math.random() * apiData.upscaled.length)];
        const thisImageUrl = `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/assets/${randomUpscaledId}/${randomUpscaledId}.png`;

        const ipfsHash = await uploadToPinataFromUrl(thisImageUrl);
        if (!ipfsHash || ipfsHash == null) return;
        const nftMetadata = {
          name: "you",
          description: anky.imagePrompt,
          image: `ipfs://${ipfsHash}`,
        };
        const ipfsMetadataHash = await uploadMetadataToPinata(nftMetadata);

        if (!ipfsMetadataHash || ipfsMetadataHash == null) return;
        const result = await v2.uploader.upload(thisImageUrl);
        await prisma.midjourneyOnAFrame.update({
          where: { userFid: anky.userFid },
          data: {
            imagineApiStatus: apiData.status,
            imageIPFSHash: ipfsHash,
            metadataIPFSHash: ipfsMetadataHash,
            wasCastedOnFrame: true,
            imageAvailableUrl: result.url,
          },
        });
        let thisCastOptions = {
          parent: `${anky.castHash}`,
          text: `Hey @${userResponse.result.user.username}, your anky is ready.\n\nYou can mint it on the frame.`,
          embeds: [
            {
              url: `https://api.anky.lat/farcaster-frames/mint-this-anky?midjourneyId=${anky.imagineApiID}&revealed=false&mint=false`,
            },
          ],
          signer_uuid: process.env.MFGA_SIGNER_UUID,
        };
        const thisCastCreationResponse = await axios.post(
          "https://api.neynar.com/v2/farcaster/cast",
          thisCastOptions,
          {
            headers: {
              api_key: process.env.MFGA_API_KEY,
            },
          }
        );
        console.log("the cast was shipped");
      } else if (apiData.status === "failed") {
        await createImageAgain(anky);
      } else {
        await prisma.midjourneyOnAFrame.update({
          where: { userFid: anky.userFid },
          data: { imagineApiStatus: apiData.status },
        });
      }
    } catch (error) {
      console.error(
        `Error updating GeneratedAnky with cid ${anky.userFid}: `,
        error?.response?.data?.errors || error
      );
    }
  }
};

const createImageAgain = async (anky) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };
    const responseFromImagineApi = await axios.post(
      `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
      {
        prompt: anky.imagePrompt,
      },
      config
    );
    await prisma.midjourneyOnAFrame.update({
      where: { userFid: anky.userFid },
      data: {
        imagineApiStatus: "pending",
        imagineApiID: responseFromImagineApi.data.data.id,
      },
    });
  } catch (error) {
    console.log("there was an error creating the image again,", error);
  }
};

module.exports = { checkAndUpdateAnkys, checkAndUpdateMidjourneyOnAFrameAnkys };
