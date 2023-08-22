require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const cron = require('node-cron');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  getNewRandomCharacter,
} = require('./lib/ankyGenerationMessagesForTraits');
const { generateCharacterStory } = require('./lib/newGenesis');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// TO RESTRICT FETCHING FROM SPECIFIC ADDRESS - ENABLE THIS FOR pwa.anky.lat
// app.use(
//   cors({
//     origin: 'https://pwa.anky.lat',
//   })
// );

const PORT = process.env.PORT || 3000;

const subscriptions = [];

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};
webPush.setVapidDetails(
  'mailto:jpfraneto@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.get('/', (req, res) => {
  res.send('Welcome to Anky Backend!');
});

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('Adding a subscriotion', subscription);
  subscriptions.push(subscription);
  res.status(201).json({ success: true });
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
  try {
    // This character is a random character from the ankyverse, with the normal traits that all of them have.
    const character = getNewRandomCharacter();
    // With that information, we go to chatgtp and as for the three elements: Image description, bio and name.
    const characterNew = await generateCharacterStory(character, writing);
    console.log('In here, the character new is: ', characterNew);
    // const {
    //   promptForMidjourney,
    //   characterName,
    //   characterBackstory,
    //   completionResponse,
    //   imagineApiId,
    // } = response.newCharacter;

    return res.json({ character: characterNew });
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
