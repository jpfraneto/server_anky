const { getNewRandomCharacter } = require('./anky-traits');
const { generateCharacterStory } = require('./chatgtp');
const { fetchImageProgress } = require('./midjourney');

async function generateAnkyFromUserWriting(userWriting) {
  try {
    console.log('Inside the generate anky from user writing function');
    const randomCharacter = await getNewRandomCharacter();
    const newCharacter = await generateCharacterStory(
      randomCharacter,
      userWriting
    );
    console.log(
      'Inside the generateAnkyFromUserWriting, and the created Anky is: ',
      newCharacter
    );
    // At this point the process of generating the anky is done on the background.
    return newCharacter;
  } catch (error) {}
}

async function checkIfAnkyImageIsReady(newCharacter) {
  const responseFromImagineApi = await fetchImageProgress(newCharacter);
}

module.exports = { generateAnkyFromUserWriting };
