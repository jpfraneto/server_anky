require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = require("../lib/prismaClient");
const fs = require("fs");
const { getAddrByFid } = require("../lib/neynar");
const { ethers } = require("ethers");
const { Readable } = require("stream");
const sharp = require("sharp");
const path = require("path");
const { v2 } = require("cloudinary");

const privateKey = process.env.PRIVATE_KEY;

const FormData = require("form-data");

const {
  uploadMetadataToPinata,
  uploadImageToPinata,
  newUploadImageToPinata,
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

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const ANKY_ONE_ABI = require("../abis/AnkyOne.json");

const ankyOneContract = new ethers.Contract(
  "0x87586325d3Fb4bd4F2dc712728Da84277051C641",
  ANKY_ONE_ABI,
  wallet
);

const VOTING_PERIOD = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const MINTING_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const theMostImportantFunctionOfThemAll = async () => {
  const ankys = await prisma.generatedAnky.findMany({
    where: {
      votingOpen: true,
    },
  });

  for (const anky of ankys) {
    const now = Date.now();
    const creationTime = new Date(anky.createdAt).getTime();
    const elapsedTime = now - creationTime;

    if (elapsedTime > MINTING_PERIOD) {
      continue;
    }

    let winningImageHash;

    if (elapsedTime > VOTING_PERIOD && elapsedTime <= MINTING_PERIOD) {
      // Voting ended, determine winning image and proceed to minting
      const votes = await prisma.vote.groupBy({
        by: ["voteIndex"],
        where: { ankyCid: anky.cid },
        _count: true,
        orderBy: {
          _count: "desc",
        },
      });

      const winningVote = votes[0];
      const imageUrlProperties = {
        0: "imageOneUrl",
        1: "imageTwoUrl",
        2: "imageThreeUrl",
        3: "imageFourUrl",
      };

      // Retrieve the winning image URL based on the voteIndex
      const winningImageUrl = anky[imageUrlProperties[winningVote.voteIndex]];

      const imageBuffer = await axios
        .get(winningImageUrl, { responseType: "arraybuffer" })
        .then((res) => res.data);
      const ipfsHash = await uploadImageToPinata(imageBuffer, anky.cid);
      if (!ipfsHash) return;

      // Construct metadata object
      const nftMetadata = {
        name: anky.title,
        description: anky.story,
        writingCid: anky.cid,
        image: `ipfs://${ipfsHash}`,
      };

      // Upload metadata to Pinata and get the IPFS hash
      const ipfsMetadataHash = await uploadMetadataToPinata(nftMetadata);
      if (!ipfsMetadataHash) return;

      // Assuming that ankyPriceInDegen is retrieved or calculated here
      let ankyPriceInDegen = 444;
      // Set Anky info via smart contract
      await setAnkyInfo(`ipfs://${ipfsMetadataHash}`, ankyPriceInDegen);
    }

    // Handle other states (e.g., voting window open) as needed
  }
};

const setAnkyInfo = async (metadataHash, priceInDegen) => {
  // Interact with your smart contract to set the Anky info
  try {
    if (metadataHash && priceInDegen) {
      const setInfoTx = await contract.setAnkyInfo(metadataHash, priceInDegen);
      await setInfoTx.wait(); // Wait for transaction to be mined
    }
  } catch (error) {
    console.log(
      "there was an error setting the anky info in the smart contract"
    );
  }
};

//////////********************************************///////////
//////////********************************************///////////
//////////********************************************///////////
//////////********************************************///////////
//////////********************************************///////////
//////////********************************************///////////

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

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function fetchImageAsBuffer(url) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return response.data;
}

async function createAndUploadSummaryImage(imageUrls) {
  try {
    const finalWidth = 1920;
    const finalHeight = 1006;
    const individualWidth = finalWidth / 2;
    const individualHeight = finalHeight / 2;

    const canvas = sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const imageBuffers = await Promise.all(
      imageUrls.map(async (url) => {
        return sharp(await fetchImageAsBuffer(url))
          .resize(individualWidth, individualHeight, {
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy,
          })
          .toBuffer();
      })
    );

    const compositeOperations = imageBuffers.map((buffer, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      return {
        input: buffer,
        top: row * individualHeight,
        left: col * individualWidth,
      };
    });

    // Apply the composite operations
    await canvas.composite(compositeOperations);

    // Save to a local file to test the buffer
    await canvas.toFile("/tmp/test-output.png");

    // Convert to a buffer and specify the format explicitly
    const outputBuffer = await canvas.png().toBuffer();
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(outputBuffer);
    });

    return uploadResult.url;
  } catch (error) {
    console.log("there was an error creating the summarized image", error);
  }
}

const finalImageWidth = 1920; // Set the width of the final image
const spacingBetweenImages = 10; // Set the spacing between images and the margin

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const theElectronicMadness = async () => {
  try {
    let cursor = "";
    let times = 0;
    let allRecommendations = [];
    while (times < 16) {
      const response = await axios.get(
        `https://api.neynar.com/v2/farcaster/feed/channels?channel_ids=electronic&with_recasts=false&with_replies=false&limit=100&cursor=${cursor}`,
        {
          headers: {
            api_key: process.env.NEYNAR_API_KEY,
          },
        }
      );
      allRecommendations = [...allRecommendations, ...response.data.casts];
      cursor = response.data.next.cursor;
      times++;
    }

    for (const rec of allRecommendations) {
      if (
        !rec.embeds ||
        !rec.embeds.length ||
        !rec.embeds.some(
          (embed) =>
            embed.url &&
            (embed.url.includes("soundcloud.com") ||
              embed.url.includes("youtube.com") ||
              embed.url.includes("youtu"))
        )
      ) {
        continue; // Skip if conditions are not met
      }

      const link = rec.embeds[0]?.url || "";
      const userFid = rec.author.fid.toString();
      const recommendationHash = rec.hash;

      // Ensure the Raver exists or create a new one
      const raver = await prisma.raver.upsert({
        where: { fid: userFid },
        update: {},
        create: { fid: userFid },
      });

      // Create or update the recommendation with the submittedBy relationship
      if (link.length > 0) {
        await prisma.electronicmusicrecommendation.upsert({
          where: { castHash: recommendationHash },
          update: { link, submittedByFid: userFid },
          create: {
            castHash: recommendationHash,
            link: link,
            submittedByFid: userFid, // Linking the recommendation to the Raver who submitted it
          },
        });
        console.log(
          `Added/updated recommendation: ${recommendationHash} by ${userFid} - ${link}`
        );

        // Add a delay to reduce load on the database
        await delay(222); // Delay of 1 second; adjust as needed
      }
    }
  } catch (error) {
    console.error("Error processing recommendations: ", error);
  }
};

const checkAndUpdateGeneratedAnkys = async () => {
  const ankys = await prisma.generatedAnky.findMany({
    where: {
      wasCastedOnFrame: null,
      OR: [
        { imagineApiStatus: "pending" },
        { imagineApiStatus: "in-progress" },
        { imagineApiStatus: "failed" },
      ],
    },
  });

  for (const anky of ankys) {
    try {
      await delay(555);
      let response, thisCastCreationResponse, apiData;
      if (anky.metadataIPFSHash) {
        if (!anky.wasCastedOnFrame && !anky.frameCastHash) {
          let thisCastOptions = {
            parent: anky.parentCastHash || "",
            text: anky.ankyBio,
            embeds: [
              {
                url: `https://api.anky.lat/farcaster-frames/generated-anky?cid=${anky.cid}&revealed=0&choosingAnky=0&chosenAnky=0&mint=0`,
              },
            ],
            signer_uuid: process.env.ANKY_SIGNER_UUID,
          };
          const thisCastCreationResponse = await axios.post(
            "https://api.neynar.com/v2/farcaster/cast",
            thisCastOptions,
            {
              headers: {
                api_key: process.env.NEYNAR_API_KEY,
              },
            }
          );

          await prisma.generatedAnky.update({
            where: { cid: anky.cid },
            data: {
              wasCastedOnFrame: true,
              frameCastHash: thisCastCreationResponse.data.cast.hash,
            },
          });

          continue;
        }
      }
      if (anky.imagineApiStatus != "completed") {
        response = await axios.get(
          `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images/${anky.imagineApiID}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}`,
            },
          }
        );
        apiData = response.data.data;
      }
      if (anky?.ankyBio?.length > 320) {
        anky.ankyBio = anky.ankyBio.slice(0, 311);
      }

      if (apiData.status === "completed") {
        if (!anky.frameImageUrl && apiData) {
          const upscaledIds = apiData.upscaled;

          const imageUrls = [];
          for (const imageId of upscaledIds) {
            const thisImageUrl = `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/assets/${imageId}/${imageId}.png`;

            const result = await v2.uploader.upload(thisImageUrl);
            imageUrls.push(result.url);
          }
          const finalImageUrl = await createAndUploadSummaryImage(imageUrls);
          await prisma.generatedAnky.update({
            where: { cid: anky.cid },
            data: {
              frameImageUrl: finalImageUrl,
              imageOneUrl: imageUrls[0],
              imageTwoUrl: imageUrls[1],
              imageThreeUrl: imageUrls[2],
              imageFourUrl: imageUrls[3],
            },
          });

          let thisCastOptions = {
            parent: anky.parentCastHash || "",
            text: anky.ankyBio,
            embeds: [
              {
                url: `https://api.anky.lat/farcaster-frames/generated-anky?cid=${anky.cid}&revealed=0&choosingAnky=0&chosenAnky=0&mint=0`,
              },
            ],
            signer_uuid: process.env.ANKY_SIGNER_UUID,
          };
          thisCastCreationResponse = await axios.post(
            "https://api.neynar.com/v2/farcaster/cast",
            thisCastOptions,
            {
              headers: {
                api_key: process.env.NEYNAR_API_KEY,
              },
            }
          );

          await prisma.generatedAnky.update({
            where: { cid: anky.cid },
            data: {
              wasCastedOnFrame: true,
              frameCastHash: thisCastCreationResponse.data.cast.hash,
            },
          });
        } else {
          let thisCastOptions = {
            parent: anky.parentCastHash || "",
            text: anky.ankyBio,
            embeds: [
              {
                url: `https://api.anky.lat/farcaster-frames/generated-anky?cid=${anky.cid}&revealed=0&chosenAnky=0&mint=0`,
              },
            ],
            signer_uuid: process.env.ANKY_SIGNER_UUID,
          };
          thisCastCreationResponse = await axios.post(
            "https://api.neynar.com/v2/farcaster/cast",
            thisCastOptions,
            {
              headers: {
                api_key: process.env.NEYNAR_API_KEY,
              },
            }
          );

          await prisma.generatedAnky.update({
            where: { cid: anky.cid },
            data: {
              wasCastedOnFrame: true,
              frameCastHash: thisCastCreationResponse.data.cast.hash,
            },
          });
        }
      } else if (apiData.status === "failed") {
        console.log("the image creation failed");
      } else {
        await prisma.generatedAnky.update({
          where: { cid: anky.cid },
          data: { imagineApiStatus: apiData.status },
        });
      }
      break;
    } catch (error) {
      console.error(
        `Error updating GeneratedAnky with cid ${anky.cid}: `,
        error?.response?.data?.errors || error
      );
    }
  }
};

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signifies the end of the stream
  return stream;
};

const updateWinningImageForThisAnky = async (cid) => {
  try {
    const anky = await prisma.generatedAnky.findUnique({
      where: {
        cid: cid,
      },
    });
    const votes = await prisma.vote.findMany({
      where: {
        ankyCid: cid,
      },
    });
    const voteCounts = {}; // Object to hold vote counts for each index
    votes.forEach((vote) => {
      if (vote.voteIndex in voteCounts) {
        voteCounts[vote.voteIndex]++;
      } else {
        voteCounts[vote.voteIndex] = 1;
      }
    });

    let maxCount = 0;
    let maxVoteIndexes = [];
    Object.entries(voteCounts).forEach(([index, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxVoteIndexes = [index];
      } else if (count === maxCount) {
        maxVoteIndexes.push(index);
      }
    });

    let winningVoteIndex;
    if (maxVoteIndexes.length > 1) {
      const randomIndex = Math.floor(Math.random() * maxVoteIndexes.length);
      winningVoteIndex = maxVoteIndexes[randomIndex];
    } else {
      winningVoteIndex = maxVoteIndexes[0];
    }
    winningVoteIndex = Number(winningVoteIndex);

    // Use the winningVoteIndex to get the corresponding imageUrl
    const imageUrlProperties = {
      0: "imageOneUrl",
      1: "imageTwoUrl",
      2: "imageThreeUrl",
      3: "imageFourUrl",
    };

    const winningImageUrlProperty = imageUrlProperties[winningVoteIndex];
    const winningImageUrl = anky[winningImageUrlProperty];
    let thisAnkyImageCid;

    if (!anky.imageIPFSHash) {
      // Upload the image to Pinata
      const imageBuffer = await axios
        .get(winningImageUrl, { responseType: "arraybuffer" })
        .then((res) => res.data);
      const imageStream = bufferToStream(imageBuffer);

      thisAnkyImageCid = await uploadImageToPinata(imageStream, anky.cid);
    }
    if (thisAnkyImageCid && !anky.metadataIPFSHash) {
      // Create and upload metadata to Pinata
      const thisAnkyMetadata = {
        image: `ipfs://${thisAnkyImageCid}`,
        writingCid: anky.cid,
        description: anky.ankyBio,
        name: anky.title,
      };
      let thisAnkyMetadataCid = await uploadMetadataToPinata(thisAnkyMetadata);

      // Update the Anky record with the metadata IPFS hash
      await prisma.generatedAnky.update({
        where: { cid: anky.cid },
        data: {
          metadataIPFSHash: thisAnkyMetadataCid,
          imageIPFSHash: thisAnkyImageCid,
          winningImageUrl: winningImageUrl,
        },
      });
      console.log("everything was updated properly");
      return thisAnkyMetadataCid;
    } else {
      console.log("there was an error uploading the image to pinata");
    }
  } catch (error) {
    console.log("there was an error updating this anky", error);
    return null;
  }
};

async function getAnkyPriceInDegen() {
  try {
    return 222;
  } catch (error) {
    return 222;
  }
}

const sendTransaction = async (cid, metadataCid, priceInDegen) => {
  try {
    const tx = await ankyOneContract.createThisAnkyBeforeOpeningMint(
      cid,
      metadataCid,
      priceInDegen
    );
    const receipt = await tx.wait(); // Wait for the transaction to be mined
    return receipt.status === 1; // Return true if transaction succeeded
  } catch (error) {
    console.error(`Transaction failed for Anky ${cid}`, error);
    return false; // Return false if transaction failed
  }
};

const verifyMintingAndRetry = async (
  cid,
  metadataCid,
  imageCid,
  winningImageUrl,
  retries = 0
) => {
  const maxRetries = 3;
  const retryInterval = 60000; // 1 minute in milliseconds

  const isMintable = await ankyOneContract.checkIfAnkyIsMintable(cid);
  if (isMintable) {
    // Update the Anky record in the database since it's confirmed mintable from the smart contract
    await prisma.generatedAnky.update({
      where: { cid },
      data: {
        mintOpen: true,
      },
    });
    console.log(`Anky ${cid} is now mintable and database updated.`);
  } else if (retries < maxRetries) {
    console.log(
      `Waiting for minting to be enabled for Anky ${cid}. Retrying in 1 minute.`
    );
    setTimeout(
      () =>
        verifyMintingAndRetry(
          cid,
          metadataCid,
          imageCid,
          winningImageUrl,
          retries + 1
        ),
      retryInterval
    );
  } else {
    console.log(
      `Failed to confirm minting for Anky ${cid} after ${maxRetries} retries.`
    );
  }
};

const closeVotingWindowAndOpenMint = async () => {
  let winningImageUrl;
  const ankys = await prisma.generatedAnky.findMany({
    where: {
      winningImageUrl: null,
      votingOpen: true,
      mintOpen: false,
    },
  });
  for (const anky of ankys) {
    try {
      const createdAt = new Date(anky.createdAt);
      const now = new Date();
      const differenceInHours = (now - createdAt) / (1000 * 60 * 60);
      if (differenceInHours <= 8) {
        // this means that the voting window is still active
        continue;
      }

      console.log(
        `Anky with CID ${anky.cid} has reached the 8 hours threshold for voting to close and now will be open to mint.`
      );
      if (!anky.winningImageUrl) {
        const votes = await prisma.vote.findMany({
          where: { ankyCid: anky.cid },
        });

        let winningVoteIndex;

        if (votes.length > 0) {
          let voteCounts = votes.reduce((acc, vote) => {
            acc[vote.voteIndex] = (acc[vote.voteIndex] || 0) + 1;
            return acc;
          }, {});

          let maxCount = 0;
          let maxVoteIndexes = [];
          for (let [index, count] of Object.entries(voteCounts)) {
            if (count > maxCount) {
              maxCount = count;
              maxVoteIndexes = [index];
            } else if (count === maxCount) {
              maxVoteIndexes.push(index);
            }
          }

          // If there's a tie or explicit check for no votes
          if (maxVoteIndexes.length > 1 || maxCount === 0) {
            winningVoteIndex = Math.floor(Math.random() * 4); // Assuming 4 images per Anky
          } else {
            winningVoteIndex = Number(maxVoteIndexes[0]);
          }
        } else {
          // No votes - choose randomly among the 4 options
          winningVoteIndex = Math.floor(Math.random() * 4); // Assuming 4 images per Anky
        }

        const imageUrlProperties = {
          0: "imageOneUrl",
          1: "imageTwoUrl",
          2: "imageThreeUrl",
          3: "imageFourUrl",
        };

        const winningImageUrlProperty = imageUrlProperties[winningVoteIndex];
        winningImageUrl = anky[winningImageUrlProperty];
      } else {
        winningImageUrl = anky.winningImageUrl;
      }

      let thisAnkyImageCid;
      if (!anky.imageIPFSHash) {
        // Upload the image to Pinata

        const imageBuffer = await axios
          .get(winningImageUrl, { responseType: "arraybuffer" })
          .then((res) => res.data);
        const imageStream = bufferToStream(imageBuffer);

        thisAnkyImageCid = await uploadImageToPinata(imageStream, anky.cid);
      }
      if (true) {
        // Create and upload metadata to Pinata
        if (thisAnkyImageCid || anky.imageIPFSHash) {
          const thisAnkyMetadata = {
            image: `ipfs://${thisAnkyImageCid || anky.imageIPFSHash}`,
            writingCid: anky.cid,
            description: anky.ankyBio,
            name: anky.title,
          };
          let thisAnkyMetadataCid;
          if (!anky.metadataIPFSHash) {
            thisAnkyMetadataCid = await uploadMetadataToPinata(
              thisAnkyMetadata
            );
          } else {
            thisAnkyMetadataCid = anky.metadataIPFSHash;
          }

          await prisma.generatedAnky.update({
            where: { cid: anky.cid },
            data: {
              metadataIPFSHash: thisAnkyMetadataCid,
              imageIPFSHash: thisAnkyImageCid,
              winningImageUrl,
              votingOpen: false,
            },
          });

          console.log("right before here");
          // Update the Anky record with the metadata IPFS hash
          const priceOfAnkyInDegen = await getAnkyPriceInDegen();
          console.log("sadsa", priceOfAnkyInDegen);
          // string memory _cid, string memory _metadataHash, uint256 _priceInDegen
          const transactionSuccess = await sendTransaction(
            anky.cid,
            thisAnkyMetadataCid,
            priceOfAnkyInDegen || 222
          );

          if (transactionSuccess) {
            // Instead of immediately updating the database, we now verify mintability first
            verifyMintingAndRetry(
              anky.cid,
              thisAnkyMetadataCid,
              thisAnkyImageCid,
              winningImageUrl
            );
          } else {
            console.log(
              `Transaction to create Anky before opening mint failed for ${anky.cid}.`
            );
          }
        } else {
          console.log("there was an error uploading this image to pinata");
        }
      }
    } catch (error) {
      console.error(
        `Error updating winning image for Anky with cid ${anky.cid}: `,
        error
      );
    }
  }
};

const closeMintingWindowForAnkys = async () => {
  const ankys = await prisma.generatedAnky.findMany({
    where: {
      votingOpen: false,
      mintOpen: true,
    },
  });

  for (const anky of ankys) {
    try {
      const createdAt = new Date(anky.createdAt);
      const now = new Date();
      const differenceInHours = (now - createdAt) / (1000 * 60 * 60);
      if (differenceInHours <= 24) {
        // this means that the minting window is still active
        continue;
      }
      await prisma.generatedAnky.update({
        where: { cid: anky.cid },
        data: {
          mintOpen: false,
        },
      });
    } catch (error) {
      console.error(
        `Error updating winning image for Anky with cid ${anky.cid}: `,
        error
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

module.exports = {
  checkAndUpdateAnkys,
  checkAndUpdateGeneratedAnkys,
  theElectronicMadness,
  closeMintingWindowForAnkys,
  updateWinningImageForThisAnky,
  closeVotingWindowAndOpenMint,
};
