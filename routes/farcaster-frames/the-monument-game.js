const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky</title>
      <meta property="og:title" content="anky">
      <meta property="og:image" content="https://jpfraneto.github.io/images/the-monument-game-anky.png">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/the-monument-game-anky.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:button:1" content="write">
      <meta name="fc:frame:button:1:action" content="link">   
      <meta name="fc:frame:button:1:target" content="https://www.anky.lat">   
      </head>
    </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
