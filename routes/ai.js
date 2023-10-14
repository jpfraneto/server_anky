const express = require('express');
const { openai } = require('openai');
const { generateAnkyFromUserWriting } = require('../lib/ai/anky-factory');
const { fetchImageProgress } = require('../lib/ai/midjourney');
const { reflectUserWriting } = require('../lib/ai/chatgtp'); // Import the functions
const { getInitialAnkyDementorNotebook } = require('../lib/ai/anky-dementor');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('in the ai get route');
});

router.post('/tell-me-who-you-are', async (req, res) => {
  try {
    console.log('inside the tell us who you are route', req.body);

    // Error handling if the body doesn't have 'text'
    if (!req.body.finishText) {
      return res
        .status(400)
        .json({ error: "The 'text' parameter is missing." });
    }

    const cid = await getInitialAnkyDementorNotebook(req.body.finishText);
    console.log('out heere', cid);
    res.status(200).json({ cid: cid }); // changed the response to be more meaningful
  } catch (error) {
    console.log('There was an error');
    res.status(500).json({ message: 'server error' });
  }
});

router.post('/get-feedback-from-writing', async (req, res) => {
  console.log('Inside the get feedback from writing route', req.body);
  const response = await reflectUserWriting(
    req.body.text,
    req.body.user,
    req.body.prompt,
    res
  );
  res.json({ ankyResponse: response });
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
