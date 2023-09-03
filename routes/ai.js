const express = require('express');
const { openai } = require('openai');
const { generateAnkyFromUserWriting } = require('../lib/ai/anky-factory');
const { fetchImageProgress } = require('../lib/ai/midjourney');
const { reflectUserWriting } = require('../lib/ai/chatgtp'); // Import the functions
const router = express.Router();

router.get('/', (req, res) => {
  console.log('in the ai get route');
});

router.post('/get-feedback-from-writing', async (req, res) => {
  console.log('Inside the get feedback from writing route', req.body);
  const response = await reflectUserWriting(req.body.text, {}, req.body.prompt);
  console.log('the response is: ', response);
  res.json({ 123: 456 });
});

router.post('/create-anky-from-writing', async (req, res) => {
  console.log('Inside the create anky from writing function');
  const response = await generateAnkyFromUserWriting(req.body.text);
  console.log('The response is: ', response);
  res.json({ anky: response });
});

router.get('/check-image/:imageId', async (req, res) => {
  console.log('checking the image with the following id: ', req.params.imageId);
  const imageId = req.params.imageId;
  const imageProgress = await fetchImageProgress(imageId);
  if (imageProgress) {
    return res.json(imageProgress);
  } else {
    return res.status(404).send('Image not found');
  }
});

module.exports = router;
