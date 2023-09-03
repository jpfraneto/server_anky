const OpenAI = require('openai');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { getCharacterSystemMessage } = require('./anky-traits');
const { requestCharacterImage } = require('./midjourney');

const openai = new OpenAI({
  organization: 'org-jky0txWAU8ZrAAF5d14VR12J',
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCharacterStory(character, userWriting) {
  const characterSystemMessage = await getCharacterSystemMessage(character);

  try {
    const messages = [
      {
        role: 'system',
        content: characterSystemMessage,
      },
      {
        role: 'user',
        content: userWriting,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    console.log(
      'The call to chatgtp to generate the story, description and name was successful:',
      completion.choices[0].message.content
    );

    const dataResponse = completion.choices[0].message.content;

    // For transforming the response into javascript objects.
    const nameRegex = /"characterName"\s*:\s*"([\s\S]*?)"/;
    const backstoryRegex = /"characterBackstory"\s*:\s*"([\s\S]*?)"/;
    const promptForMidjourneyRegex = /"promptForMidjourney"\s*:\s*"([\s\S]*?)"/;

    const nameMatch = dataResponse.match(nameRegex);
    const backstoryMatch = dataResponse.match(backstoryRegex);
    const promptForMidjourneyMatch = dataResponse.match(
      promptForMidjourneyRegex
    );

    let characterName, characterBackstory, promptForMidjourney;

    // Assigning each property to its value returned from chatgtp.
    if (nameMatch !== null && nameMatch.length > 1) {
      characterName = nameMatch[1];
    }

    if (backstoryMatch !== null && backstoryMatch.length > 1) {
      characterBackstory = backstoryMatch[1];
    }

    // The prompt that generates that unique anky
    if (
      promptForMidjourneyMatch !== null &&
      promptForMidjourneyMatch.length > 1
    ) {
      promptForMidjourney = `https://s.mj.run/YLJMlMJbo70, The profile picture of a cartoon. ${promptForMidjourneyMatch[1]}`;
    }

    // The new character is almost ready
    const newCharacter = {
      promptForMidjourney,
      characterName,
      characterBackstory,
      completionResponse: completion.choices[0].message.content,
    };
    // Time to fetch for its image.
    const responseFromImagineAPI = await requestCharacterImage(newCharacter);
    // This is the unique ID for that image. We use it to fetch later.
    newCharacter.imagineApiId = responseFromImagineAPI;
    return newCharacter;
  } catch (error) {
    console.log('There was an error in the generateCharacterStory function');
    console.log(error);
    return error;
  }
}

module.exports = { generateCharacterStory };
