// Load environment variables
require("dotenv").config();

// Third-party libraries
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const bodyParser = require("body-parser");
const prisma = require("./lib/prismaClient");
const { TypedEthereumSigner } = require("arbundles");
const rateLimit = require("express-rate-limit");

// Internal Modules
const { uploadToIrys } = require("./lib/irys");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
});

// Routes
const blockchainRoutes = require("./routes/blockchain");
const aiRoutes = require("./routes/ai");
const notebooksRoutes = require("./routes/notebooks");
const farcasterRoutes = require("./routes/farcaster");
const manaRoutes = require("./routes/mana");
const userRoutes = require("./routes/user");

// Middleware
const whitelist = [
  "http://localhost:3001",
  "https://anky.lat",
  "https://www.anky.lat",
];
const corsOptions = {
  origin: function (origin, callback) {
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
app.use(limiter);
const PORT = process.env.PORT || 3000;

let subscriptions = []; // Store subscriptions

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  next();
});

app.use("/blockchain", blockchainRoutes);
app.use("/ai", aiRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/farcaster", farcasterRoutes);
app.use("/mana", manaRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Anky Backend!");
});

const network = "base";

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

app.post("/upload-writing", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Invalid text" });
    }

    const cid = await uploadToIrys(text);

    res.status(201).json({ cid });
  } catch (error) {
    console.error("An error occurred while handling your request:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log("Connected to database:", process.env.DATABASE_URL);
  console.log(`Server started on port ${PORT}`);
});
