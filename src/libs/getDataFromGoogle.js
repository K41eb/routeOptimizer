import { createClient as createGoogleMapsClient } from '@google/maps';
import { GoogleApiError } from './errors.js';

/**
 * To getDataFromGoogle we make a list of locations from the origin and destinations, and then
 * call google map's api with this list to get and return the distance matrix data.
 * 
 * @param  {object} requestBody - Raw server request body.
 *
 * @return {object} - Raw google response.
 */
async function getDataFromGoogle(requestBody){
  const locations = [
    requestBody.home,
    ...requestBody.tasks.map((task) => ({
      lat: task.lat,
      lng: task.lng,
    })),
  ];

  const googleMapsClient = createGoogleMapsClient({
    key: process.env.GOOGLE_MAPS_API_KEY,
    Promise: Promise,
  });

  let data;
  try {
    data = await googleMapsClient.distanceMatrix({
      origins: locations,
      destinations: locations,
      departure_time: requestBody.departureTime,
    }).asPromise();
  }
  catch (error) {
    throw new GoogleApiError({
      message: error.message,
      detail: error,
    });
  }

  return data;
}

export {
  getDataFromGoogle,
};
