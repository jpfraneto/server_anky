const express = require("express");
const router = express.Router();
const prisma = require("../../lib/prismaClient");

function isValidEmail(email) {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return regex.test(email);
}

router.get("/", async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");
  try {
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>anky</title>
      <meta property="og:title" content="anky">
      <meta property="og:image" content="https://jpfraneto.github.io/images/newen2.png">
      <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/newen2.png">
      <meta name="fc:frame" content="vNext">
      <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/newen-tldr?page=1">
      <meta name="fc:frame:button:1" content="tell me more">
      </head>
    </html>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

router.post("/", async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");

  try {
    if (req.query.page == "1") {
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>anky</title>
            <meta property="og:title" content="anky">
            <meta property="og:image" content="https://jpfraneto.github.io/images/newen3.png">
            <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/newen3.png">
            <meta name="fc:frame" content="vNext">
            <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/newen-tldr?page=2">
            <meta name="fc:frame:button:1" content="keep me posted">
            <meta name="fc:frame:button:2" content="know the anky writers">
            <meta name="fc:frame:button:2:action" content="link">   
            <meta name="fc:frame:button:2:target" content="https://api.anky.lat/ankywriters">   
            </head>
          </html>
            `);
    }
    if (req.query.page == "2") {
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>anky</title>
              <meta property="og:title" content="anky">
              <meta property="og:image" content="https://jpfraneto.github.io/images/email.png">
              <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/email.png">
              <meta name="fc:frame" content="vNext">
              <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/newen-tldr?page=3">
              <meta name="fc:frame:input:text" content="enter email address">
              <meta name="fc:frame:button:1" content="submit">
              </head>
            </html>
              `);
    }
    if (req.query.page == "3") {
      const validEmail = isValidEmail(req.body.untrustedData.inputText);
      if (validEmail) {
        try {
          const emailRecord = await prisma.email.create({
            data: {
              email: req.body.untrustedData.inputText,
            },
          });
          res.setHeader("Content-Type", "text/html");
          res.status(200).send(`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>anky</title>
                        <meta property="og:title" content="anky">
                        <meta property="og:image" content="https://jpfraneto.github.io/images/trust.png">
                        <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/trust.png">
                        <meta name="fc:frame" content="vNext">   
                        </head>
                      </html>
                        `);
        } catch (error) {
          res.setHeader("Content-Type", "text/html");
          res.status(200).send(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>anky</title>
                    <meta property="og:title" content="anky">
                    <meta property="og:image" content="https://jpfraneto.github.io/images/email.png">
                    <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/email.png">
                    <meta name="fc:frame" content="vNext">
                    <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/newen-tldr?page=3">
                    <meta name="fc:frame:input:text" content="enter email address">
                    <meta name="fc:frame:button:1" content="submit">
                    </head>
                  </html>
                    `);
        }
      } else {
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>anky</title>
                <meta property="og:title" content="anky">
                <meta property="og:image" content="https://jpfraneto.github.io/images/invalid.png">
                <meta name="fc:frame:image" content="https://jpfraneto.github.io/images/invalid.png">
                <meta name="fc:frame" content="vNext">
                <meta name="fc:frame:post_url" content="${fullUrl}/farcaster-frames/newen-tldr?page=3">
                <meta name="fc:frame:input:text" content="enter valid email">
                <meta name="fc:frame:button:1" content="submit">
                </head>
              </html>
                `);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

module.exports = router;
