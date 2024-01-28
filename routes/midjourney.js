const express = require("express");
const router = express.Router();
const axios = require("axios");

const imagineApiToken = process.env.IMAGINE_API_TOKEN;

router.get("/", async (req, res) => {
  try {
    console.log("inside the midjourney api route", imagineApiToken);
    const ankyImageUrl = "https://s.mj.run/YLJMlMJbo70 , ";
    const promptForMidjourney =
      ankyImageUrl +
      `the unfolding if consciousness happening through this fancy little blue monkey.`;
    const config = {
      headers: { Authorization: `Bearer ${imagineApiToken}` },
    };
    const response = await axios.post(
      `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
      { prompt: promptForMidjourney },
      config
    );
    console.log("the response from the server is: ", response.data);
    res.status(200).json({ 123: 456 });
  } catch (error) {
    console.log("there was an error generating the image", error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
