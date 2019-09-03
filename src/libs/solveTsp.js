import tspSolver from 'node-tspsolver';

import { InternalServerError } from './errors.js';

/**
 * Take a matrix distance where matrix[i][j] is the "distance" from point i to point j.
 * In our case "distances" are actually travel times. It returns the order in which the points
 * should be visited for optimal travel time.
 * 
 * @param  {number[][]} distancesMatrix - A distances matrix with zeroes in the diagonal.
 * 
 * @return {Promise<number[]>} - The optimal order.
 */
async function solveTsp(distancesMatrix) {
  const isRoundTrip = true;
  const options = {};

  let solution;
  try {
    solution = await tspSolver.solveTsp(distancesMatrix, isRoundTrip, options);
  }
  catch (err) {
    throw new InternalServerError({
      message: `Couldn't solve the TSP probelm: ${err.message}`,
      detail: err,
    });
  }

  return solution;
}

export {
  solveTsp,
};
