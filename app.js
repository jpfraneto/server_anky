require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const cron = require('node-cron');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { TypedEthereumSigner } = require('arbundles');
const { prisma } = require('./lib/prismaClient');
const { uploadToBundlr } = require('./lib/bundlrSetup');
const {
  getNewRandomCharacter,
} = require('./lib/ankyGenerationMessagesForTraits');
const { generateCharacterStory } = require('./lib/newGenesis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  bundlrSetupDevnet();
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
  const writings = await prisma.writing.findMany({});
  console.log('the writings are:', writings);
  res.json(writings);
});

app.post('/upload-writing', async (req, res) => {
  try {
    console.log('IN HERE', req.body);
    const { text, date } = req.body;
    if (!text || !date) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const bundlrResponseId = await uploadToBundlr(text);
    console.log('the bundlr response is: ', bundlrResponseId);
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

app.get('/check-image/:imageId', async (req, res) => {
  console.log('checking the image with the following id: ', req.params.imageId);
  const imageId = req.params.imageId;
  const config = {
    headers: { Authorization: `Bearer ${process.env.IMAGINE_API_KEY}` },
  };

  try {
    const response = await axios.get(
      `http://146.190.131.28:8055/items/images/${imageId}`,
      config
    );
    console.log('the response.data is: ', response.data);
    if (response.data && response.data?.data) {
      res.json(response.data.data);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.log('And the error fetchin the image is: ', error);
    res.status(500).send('Error fetching image');
  }
});

app.post('/get-anky-image', async (req, res) => {
  console.log('in here, the writing is: ', req.body);
  const writing = req.body.text;
  res.json({ status: 'processing' });
  try {
    // This character is a random character from the ankyverse, with the normal traits that all of them have.
    const character = getNewRandomCharacter();
    // With that information, we go to chatgtp and as for the three elements: Image description, bio and name.
    const characterNew = await generateCharacterStory(character, writing);
    console.log('In here, the character new is: ', characterNew);
  } catch (error) {
    console.log('There was a big error in this thing.', error);

    if (error.response) {
      console.log(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log('THE ERROR IS: ', error);
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
});

async function fetchImage(imageId) {
  const config = {
    headers: { Authorization: `Bearer ${process.env.IMAGINE_API_KEY}` },
  };
  try {
    const response = await axios.get(
      `http://146.190.131.28:8055/items/images/${imageId}`,
      config
    );
    console.log('Fetched from imagineAPI', response.data.data);
    return response.data.data;
  } catch (error) {}
}

async function fetchImage(req, res) {
  console.log('INSIDE HEREEE, fetching the image');
  if (req.method !== 'POST') {
    return res.status(401);
  }
  const imageId = req.body.imageId;
  console.log('THE IMAGE ID IS: ', imageId);
  try {
    const imageResponse = await fetchImage(imageId);
    console.log('the image Response is: ', imageResponse);
    res.json(imageResponse);
  } catch (error) {
    console.log('the error is: ', error);
    res.json(error);
  }
}

const sendNotifications = () => {
  console.log('inside the send notifications function', subscriptions);
  subscriptions.forEach(sub => {
    const payload = JSON.stringify({
      title: 'Vamos ctm',
      body: 'Nueva notificacion de Anky',
    });

    webPush.sendNotification(sub, payload).catch(error => {
      console.error(error.stack);
    });
  });
};

cron.schedule('*/1 * * * *', sendNotifications);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
