const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.redirect(302, `https://www.anky.lat/mint-an-anky/${req.query.cid}`);
  } catch (error) {
    console.log("there was an error on the redirecter");
  }
});

router.post("/", async (req, res) => {
  try {
    res.redirect(302, `https://www.anky.lat/mint-an-anky/${req.query.cid}`);
  } catch (error) {
    console.log("there was an error on the redirecter");
  }
});

module.exports = router;
