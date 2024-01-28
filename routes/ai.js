const express = require("express");
const { generateAnkyFromUserWriting } = require("../lib/ai/anky-factory");
const { fetchImageProgress } = require("../lib/ai/midjourney");
const prisma = require("../lib/prismaClient");

const OpenAI = require("openai");
const axios = require("axios");
const { reflectUserWriting } = require("../lib/ai/chatgtp"); // Import the functions
const {
  getInitialAnkyDementorNotebook,
  getSubsequentAnkyDementorNotebookPage,
  getThisPageStory,
} = require("../lib/ai/anky-dementor");
const checkIfLoggedInMiddleware = require("../middleware/checkIfLoggedIn");
const { uploadToBundlr } = require("../lib/bundlrSetup");
const { uploadImageToPinata } = require("../lib/pinataSetup");
const router = express.Router();

const openai = new OpenAI();

router.post("/process-writing", async (req, res) => {
  if (!openai) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const message = req.body.text || "";
  const cid = req.body.cid;
  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      },
    });
    return;
  }
  try {
    const messages = [
      {
        role: "system",
        content: `You are in charge of imagining a description of a human being in a cartoon world. I will send you a block of text that was written as a stream of consciousness, and your goal is to distill the essence of that writing so that you can come up with a graphic description of how the human that wrote it looks. The important part is crafting a situation that represents the subconscious aspects of this human, so that the image that will be generated becomes a mirror of this human. Please avoid direct references to the writer, or the technologies that take place. The goal of the prompt is just to get a description of how the whole situation looks like.

    Make it no more than 333 characters long, and onky one paragraph.
    Here is the block of text: `,
      },
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_TOKEN}` },
    };

    let imagineApiID, newImagePrompt;
    if (completion) {
      newImagePrompt = `https://s.mj.run/YLJMlMJbo70, ${completion.choices[0].message.content}`;
      const responseFromImagineApi = await axios.post(
        `http://${process.env.MIDJOURNEY_SERVER_IP}:8055/items/images`,
        {
          prompt: newImagePrompt,
        },
        config
      );
      imagineApiID = responseFromImagineApi.data.data.id;

      const messages2 = [
        {
          role: "system",
          content: `You are Anky, a representation of God, and you are in charge of distilling the essence of the block of text that you will get below, so that you can create with as much detail as possible a biography of the person that wrote it. The writing is a stream of consciousness, and your mission is to write the bio that will be displayed in this persons profile.
  
          Your goal is to make this person cry of emotion, because no one ever understood her as you did now.
  
          Don't use direct references to you as the creator of the text, just write it as if this person had written it.
  
          Here is the block of text: `,
        },
        { role: "user", content: message },
      ];

      const completion2 = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages2,
      });
      console.log("the completion 2 is: ", completion2);
      if (completion2) {
        const userBio = completion2.choices[0].message.content;
        console.log("IN HERE, THE USER BIO IS: ", userBio);
        await prisma.generatedAnky.create({
          data: {
            ankyBio: userBio,
            imagineApiID: imagineApiID,
            imagePrompt: newImagePrompt,
            imagineApiStatus: "pending",
            cid: cid,
            imageIPFSHash: null,
            metadataIPFSHash: null,
          },
        });

        return res.status(200).json({
          success: true,
          imagineApiID: imagineApiID,
          userBio: userBio,
        });
      } else {
        return res.status(500).json({
          message:
            "There was an error generating the story of the human from the writing.",
        });
      }
    } else {
      return res.status(500).json({
        message: "There was an error generating the prompt from the writing.",
      });
    }
  } catch (error) {
    console.log("there was an errrorrrqascascas", error);
    return res.status(500).json({ message: "There was an error" });
  }
});

router.get("/", (req, res) => {
  console.log("in the ai get route");
});

router.post(
  "/tell-me-who-you-are",
  checkIfLoggedInMiddleware,
  async (req, res) => {
    try {
      // Error handling if the body doesn't have 'text'
      if (!req.body.finishText) {
        return res
          .status(400)
          .json({ error: "The 'text' parameter is missing." });
      }

      // return res
      //   .status(200)
      //   .json({ firstPageCid: '_2niarNbm4IcJ8S4BYVfShALzAUUhNwxoOrhSwq50wM' });

      const firstPageCid = await getInitialAnkyDementorNotebook(
        req.body.finishText
      );
      console.log("out heere", firstPageCid);
      res.status(200).json({ firstPageCid: firstPageCid }); // changed the response to be more meaningful
    } catch (error) {
      console.log("There was an error", error);
      res.status(500).json({ message: "server error" });
    }
  }
);

router.post(
  "/get-subsequent-page",
  checkIfLoggedInMiddleware,
  async (req, res) => {
    try {
      // Error handling if the body doesn't have 'text'
      if (!req.body.finishText || !req.body.prompts) {
        return res
          .status(400)
          .json({ error: "The 'text' or 'prompts' parameter is missing." });
      }

      const ankyDementorNewPagePrompts =
        await getSubsequentAnkyDementorNotebookPage(
          req.body.finishText,
          req.body.prompts
        );

      res.status(200).json({ newPrompts: ankyDementorNewPagePrompts }); // changed the response to be more meaningful
    } catch (error) {
      console.log("There was an error", error);
      res.status(500).json({ message: "server error" });
    }
  }
);

router.post(
  "/get-feedback-from-writing",
  checkIfLoggedInMiddleware,
  async (req, res) => {
    console.log("Inside the get feedback from writing route", req.body);
    const response = await reflectUserWriting(
      req.body.text,
      req.body.user,
      req.body.prompt,
      res
    );
    res.json({ ankyResponse: response });
  }
);

router.post(
  "/create-anky-from-writing",
  checkIfLoggedInMiddleware,
  async (req, res) => {
    console.log("Inside the create anky from writing function");
    const response = await generateAnkyFromUserWriting(req.body.text);
    console.log("The response is: ", response);
    res.json({ anky: response });
  }
);

router.get("/check-image/:imageId", async (req, res) => {
  console.log("checking the image with the following id: ", req.params.imageId);
  const imageId = req.params.imageId;
  const imageProgress = await fetchImageProgress(imageId);
  if (imageProgress) {
    return res.json(imageProgress);
  } else {
    return res.status(404).send("Image not found");
  }
});

module.exports = router;
