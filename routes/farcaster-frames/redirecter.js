const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("inside the redirecter", req.query);
    res.redirect(302, `https://www.anky.lat/mint-your-anky/${req.query.cid}`);
  } catch (error) {
    console.log("there was an error on the redirecter");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("inside the redirecter", req.query);
    res.redirect(302, `https://www.anky.lat/mint-your-anky/${req.query.cid}`);
  } catch (error) {
    console.log("there was an error on the redirecter");
  }
});

module.exports = router;
