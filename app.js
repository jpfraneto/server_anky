// Load environment variables
require("dotenv").config();

// Third-party libraries
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const { TypedEthereumSigner } = require("arbundles");

// Internal Modules
const { uploadToIrys } = require("./lib/irys");

// Routes
const blockchainRoutes = require("./routes/blockchain");
const aiRoutes = require("./routes/ai");
const notebooksRoutes = require("./routes/notebooks");
const farcasterRoutes = require("./routes/farcaster");

// Middleware
const whitelist = [
  "http://localhost:3001",
  "https://anky.lat",
  "https://www.anky.lat",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("the origin is: ", origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This is important.
};
// App initialization
const app = express();
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

let subscriptions = []; // Store subscriptions

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  console.log("Request URL:", req.url);
  console.log("Request Body:", req.body);
  next();
});

app.use((req, res, next) => {
  console.log("CORS headers set:", res.get("Access-Control-Allow-Origin"));
  next();
});

app.use("/blockchain", blockchainRoutes);
app.use("/ai", aiRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/farcaster", farcasterRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Anky Backend!");
});

const network = "base";
console.log("before here");
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

async function getPendingTransactionCount(wallet) {
  return await provider.getTransactionCount(wallet, "pending");
}

app.get("/publicKey", async (req, res) => {
  async function serverInit() {
    const key = process.env.PRIVATE_KEY; // your private key;
    if (!key) throw new Error("Private key is undefined!");
    const signer = new TypedEthereumSigner(key);
    return signer.publicKey;
  }

  const response = await serverInit();
  const pubKey = response.toString("hex");
  return res.status(200).json({ pubKey: pubKey });
});

app.post("/signData", async (req, res) => {
  async function signDataOnServer(signatureData) {
    const key = process.env.PRIVATE_KEY; // your private key
    if (!key) throw new Error("Private key is undefined!");
    const signer = new TypedEthereumSigner(key);
    return Buffer.from(await signer.sign(signatureData));
  }
  const body = JSON.parse(req.body);
  const signatureData = Buffer.from(body.signatureData, "hex");
  const signature = await signDataOnServer(signatureData);
  res.status(200).json({ signature: signature.toString("hex") });
});

app.get("/writings", async (req, res) => {
  console.log("inside here, prims0, ", prisma);
  const day = await prisma.day.findMany({});
  console.log("the writings are:", day);
  res.json(day);
});

app.post("/upload-writing", async (req, res) => {
  console.log("inside the upload writing route");
  try {
    console.log("IN HERE", req.body);
    const { text } = req.body;
    console.log("Time to save the writing of today", text);

    if (!text) {
      return res.status(400).json({ error: "Invalid text" });
    }

    console.log("right before here");

    const cid = await uploadToIrys(text);
    console.log("IN HEREEEE, the cid is: ", cid);

    res.status(201).json({ cid });
  } catch (error) {
    console.error("An error occurred while handling your request:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
