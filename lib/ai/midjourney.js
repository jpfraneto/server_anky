const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const IMAGINE_API_SERVER_IP = '146.190.131.28';

async function requestCharacterImage(character) {
  console.log('Inside the request character image function');
  try {
    // This variable has the response for the first call.
    const responseFromImagineApi = await fetchImageFromMidjourney(
      character.promptForMidjourney
    );

    console.log('The response from imagine api is: ', responseFromImagineApi);
    return responseFromImagineApi.id;
  } catch (error) {
    console.log('there was an error in the requestCahracterImage function');

    return null;
  }
}

async function fetchImageFromMidjourney(promptForMidjourney) {
  console.log(
    'inside the fetchimagefrommidjourney function, the prompt for midjourney is:',
    promptForMidjourney
  );
  if (!promptForMidjourney)
    return console.log('there is no prompt for midjourney!');
  try {
    // Calling imagine API to get the character.
    const config = {
      headers: { Authorization: `Bearer ${process.env.IMAGINE_API_KEY}` },
    };

    const response = await axios.post(
      `http://${IMAGINE_API_SERVER_IP}:8055/items/images`,
      { prompt: promptForMidjourney },
      config
    );
    console.log(
      'The image was prompted to midjourney, the response from this first call is: ',
      response
    );
    return response.data.data;
  } catch (error) {
    console.log('there was an error fetching imagineApi', error);
    return null;
  }
}

async function fetchImageProgress(imagineApiId) {
  const config = {
    headers: { Authorization: `Bearer ${process.env.IMAGINE_API_KEY}` },
  };
  try {
    const response = await axios.get(
      `http://${IMAGINE_API_SERVER_IP}:8055/items/images/${imagineApiId}`,
      config
    );
    console.log(
      'Fetched from imagineAPI to check the progress',
      response.data.data
    );
    return response.data.data;
  } catch (error) {}
}

// Error handler
function handleError(err) {
  console.error('An error occurred:', err);
}

module.exports = {
  requestCharacterImage,
  fetchImageFromMidjourney,
  fetchImageProgress,
};
