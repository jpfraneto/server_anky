require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const cron = require('node-cron');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { TypedEthereumSigner } = require('arbundles');
const prisma = require('./lib/prismaClient');
const { uploadToBundlr } = require('./lib/bundlrSetup');

const blockchainRoutes = require('./routes/blockchain');
const aiRoutes = require('./routes/ai');

const app = express();
const allowedOrigins = [
  'https://anky.lat',
  'http://localhost:3001',
  'http://localhost:3000',
];

app.use(cors());

app.use(bodyParser.json());
app.use('/blockchain', blockchainRoutes);
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 3000;

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};
webPush.setVapidDetails(
  'mailto:jp@anky.lat',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscription object to use it later
let subscription;

// Store subscriptions in an array (in a real-world app, you'd use a database)
let subscriptions = [];

app.get('/', (req, res) => {
  res.send('Welcome to Anky Backend!');
});

app.get('/publicKey', async (req, res) => {
  async function serverInit() {
    const key = process.env.PRIVATE_KEY; // your private key;
    if (!key) throw new Error('Private key is undefined!');
    const signer = new TypedEthereumSigner(key);
    return signer.publicKey;
  }

  const response = await serverInit();
  const pubKey = response.toString('hex');
  return res.status(200).json({ pubKey: pubKey });
});

app.post('/signData', async (req, res) => {
  async function signDataOnServer(signatureData) {
    const key = process.env.PRIVATE_KEY; // your private key
    if (!key) throw new Error('Private key is undefined!');
    const signer = new TypedEthereumSigner(key);
    return Buffer.from(await signer.sign(signatureData));
  }
  const body = JSON.parse(req.body);
  const signatureData = Buffer.from(body.signatureData, 'hex');
  const signature = await signDataOnServer(signatureData);
  res.status(200).json({ signature: signature.toString('hex') });
});

app.get('/writings', async (req, res) => {
  console.log('inside here, prims0, ', prisma);
  const day = await prisma.day.findMany({});
  console.log('the writings are:', day);
  res.json(day);
});

app.post('/upload-writing', async (req, res) => {
  console.log('inside the upload writing route');
  try {
    console.log('IN HERE', req.body);
    const { text, date } = req.body;
    const { sojourn, wink, kingdom, prompt } = date;
    console.log('Time to save the writing of today');

    if (!text || !date) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const bundlrResponseId = await uploadToBundlr(text);
    console.log('the bundlr response is: ', bundlrResponseId);
    console.log('prisma is: ', prisma);

    // Create a day record, you can adjust this logic
    const day = await prisma.day.upsert({
      where: {
        sojourn_wink: {
          sojourn,
          wink,
        },
      },
      update: {},
      create: {
        sojourn,
        wink,
        kingdom,
        prompt,
      },
    });

    console.log('the day is: ', day);

    // Create a writing record
    const prismaResponse = await prisma.writing.create({
      data: {
        bundlrURL: `https://arweave.net/${bundlrResponseId}`,
        dayId: day.id,
      },
    });
    console.log('the writing was created', prismaResponse);

    res.status(201).json({ bundlrResponseId });
  } catch (error) {
    console.error('An error occurred while handling your request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to test push notification
app.post('/test-push', async (req, res) => {
  // Your existing code
  res.json({ status: 'processing' });

  // Simulate delay
  setTimeout(async () => {
    try {
      // generateCharacterStory(character, writing);
      // Logic to generate character story goes here
      // ...

      // Sending notification to all subscribers
      subscriptions.forEach(sub => {
        webpush.sendNotification(sub, 'Your character is ready to be minted.');
      });
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }, 60000); // 4 minutes
});

app.post('/subscribe', async (req, res) => {
  const walletAddress = req.body.walletAddress;
  const subInfo = req.body.subscription;

  // Find or Create a User
  let user = await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: { walletAddress },
  });

  // Save subscription to database
  await prisma.subscription.create({
    data: {
      subInfo,
      userId: user.id,
    },
  });

  res.status(201).json({});
});

// const sendNotifications = () => {
//   console.log('inside the send notifications function', subscriptions);
//   subscriptions.forEach(sub => {
//     const payload = JSON.stringify({
//       title: 'Vamos ctm',
//       body: 'Nueva notificacion de Anky',
//     });

//     webPush.sendNotification(sub, payload).catch(error => {
//       console.error(error.stack);
//     });
//   });
// };

// cron.schedule('*/1 * * * *', sendNotifications);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
