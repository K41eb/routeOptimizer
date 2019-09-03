import { validateRequest, validateResponse } from './libs/validation.js';
import { getDataFromGoogle } from './libs/getDataFromGoogle.js';
import { getDistanceMatrix } from './libs/getDistanceMatrix.js';
import { solveTsp } from './libs/solveTsp.js';
import { getSchedule } from './libs/getSchedule.js';

/**
 * To getOptimizedRoute we validate the incomeing data, build a distances matrix from google maps's
 * api, solve the TSP problem, build a schedule, validate it, and eventually return it.
 * 
 * @param  {object} - Raw server request body.
 * 
 * @return {object} - Schedule.
 */
async function getOptimizedRoute(requestBody) {
  validateRequest(requestBody);

  const googleData = await getDataFromGoogle(requestBody);

  const distanceMatrix = getDistanceMatrix(googleData);

  const optimalPath = await solveTsp(distanceMatrix);

  const schedule = getSchedule(requestBody, distanceMatrix,  optimalPath);
  
  validateResponse(schedule);

  return schedule;
}

export {
  getOptimizedRoute,
};