const express = require("express");
const { ethers } = require("ethers");
const axios = require("axios");
const { getNftAccount } = require("../lib/blockchain/anky_airdrop"); // Import the functions
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const {
  createNotebookMetadata,
  processFetchedEulogia,
  processFetchedTemplate,
} = require("../lib/notebooks");
const { uploadImageToPinata } = require("../lib/pinataSetup");
const router = express.Router();
const ANKY_EULOGIAS_ABI = require("../abis/AnkyEulogias.json");

const ANKY_NOTEBOOKS_ABI = require("../abis/AnkyNotebooks.json");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToBundlr } = require("../lib/bundlrSetup");

// Smart contract interactions
const network = "base";

const privateKey = process.env.PRIVATE_KEY;

// // Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const ankyEulogiasContract = new ethers.Contract(
  process.env.ANKY_EULOGIAS_CONTRACT,
  ANKY_EULOGIAS_ABI,
  wallet
);

const ankyNotebooksContract = new ethers.Contract(
  process.env.ANKY_NOTEBOOKS_CONTRACT,
  ANKY_NOTEBOOKS_ABI,
  wallet
);

router.post("/", checkIfLoggedInMiddleware, async (req, res) => {
  console.log("inside the notebook post route", req.body);
  try {
    const metadataCID = await createNotebookMetadata(req.body);
    console.log("the metadata uri is: ", metadataCID);

    res.status(200).json({ metadataCID });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save metadata" });
  }
});

router.get("/notebook/:id", async (req, res) => {
  const notebookId = req.params.id;
  try {
    const thisNotebook = await ankyNotebooksContract.getNotebook(notebookId);
    const response = await axios.get(
      `https://node2.irys.xyz/${thisNotebook[1]}`
    );
    console.log("the response is: ", response);
    if (!response.status == 200) {
      throw new Error(`Failed to fetch page data for CID: ${thisNotebook[1]}`);
    }
    const jsonData = response.data;
    console.log("the json data is: ", jsonData);
    const formattedThisNotebook = {
      notebookId: ethers.formatUnits(thisNotebook[0], 0),
      metadata: jsonData,
      supply: ethers.formatUnits(thisNotebook[2], 0),
      price: ethers.formatEther(thisNotebook[3]),
    };
    res.status(200).json({ success: true, notebook: formattedThisNotebook });
  } catch (error) {
    console.log("There was an error in the notebook by id route");
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.get("/eulogia/:id", async (req, res) => {
  const eulogiaId = req.params.id;

  try {
    console.log("the euloga id i: ", eulogiaId);
    console.log("the eulogias contract is: ", ankyEulogiasContract);
    const thisEulogia = await ankyEulogiasContract.getEulogia(eulogiaId);
    console.log("this eulogia is: ", thisEulogia);
    const processedEulogia = await processFetchedEulogia(thisEulogia, wallet);
    res.status(200).json({ success: true, eulogia: processedEulogia });
  } catch (error) {
    console.log("There was an error in the eulogia by id route");
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.post("/", checkIfLoggedInMiddleware, async (req, res) => {
  console.log("inside the notebook post route", req.body);
  try {
    const metadataCID = await createNotebookMetadata(req.body);
    console.log("the metadata uri is: ", metadataCID);

    res.status(200).json({ metadataCID });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save metadata" });
  }
});

router.post(
  "/eulogia",
  checkIfLoggedInMiddleware,
  upload.fields([{ name: "coverImage" }]),
  async (req, res) => {
    try {
      console.log("inside the /eulogia/writing route", req.body);

      let coverPinataCid, backgroundPinataCid;

      // If coverImage is provided by the user, upload it. Otherwise, use the default CID.
      if (req.files.coverImage) {
        coverPinataCid = await uploadImageToPinata(
          req.files.coverImage[0].buffer
        );
        if (!coverPinataCid) {
          return res
            .status(500)
            .json({ error: "Failed to upload cover image to Pinata." });
        }
      } else {
        coverPinataCid = "QmaVBZ1PgqXoSUBP1nM8FwmVu5zjb8c6BxVrN2LD2oJw78"; // Default CID for cover
      }

      backgroundPinataCid = "QmVBnoYW16mQQ4BRQS1dsNoTqSu2JJQLnMopVdqLTqKMXN"; // Default CID for background

      console.log(
        "the cover and background cids : ",
        coverPinataCid,
        backgroundPinataCid
      );

      const metadataToUpload = {
        backgroundImageCid: backgroundPinataCid,
        coverImageCid: coverPinataCid,
        title: req.body.title,
        description: req.body.description,
      };

      const cid = await uploadToBundlr(
        JSON.stringify(metadataToUpload),
        "text"
      );
      if (!cid) {
        return res
          .status(500)
          .json({ error: "Failed to upload text to Bundlr." });
      }

      res.status(200).json({
        cid: cid,
        backgroundImageCid: backgroundPinataCid,
        coverImageCid: coverPinataCid,
      });
    } catch (error) {
      console.error("Failed to upload:", error);
      res.status(500).json({ error: "Failed to upload." });
    }
  }
);

router.post("/eulogia/writing", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    console.log("inside the /eulogia/writing route", req.body);
    const text = req.body.text;

    const cid = await uploadToBundlr(text, "text");
    res.status(200).json({ cid: cid });
  } catch (error) {
    console.error("Failed to upload text:", error);
    res.status(500).json({ error: "Failed to upload text" });
  }
});

router.post("/upload-writing", checkIfLoggedInMiddleware, async (req, res) => {
  try {
    console.log("inside the upload-writing route", req.body);
    const text = req.body.text;

    const cid = await uploadToBundlr(text, "text");
    res.status(200).json({ cid: cid });
  } catch (error) {
    console.error("Failed to upload text:", error);
    res.status(500).json({ error: "Failed to upload text" });
  }
});
// title: title,
// description: description,
// price: price,
// coverImage: coverImage,
// backgroundImage: backgroundImage,

module.exports = router;
