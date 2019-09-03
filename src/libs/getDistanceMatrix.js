/**
 * To getDistanceMatrix we map google's response to a new matrix where only the travel times remain.
 * Distance don't matter in our case because we are building a schedule. The fastest the better.
 *
 * Note: It's traditionally called a distance matrix in the TSP problem, so we stuck with the name.
 * 
 * @param  {object} googleData - The raw data returned by google.
 * 
 * @return {number[][]} - The 2-dimensional 'distance matrix'.
 */
function getDistanceMatrix(googleData) {
  return googleData.json.rows.map(
    (row) => row.elements.map(
      (element) => element.duration.value
    )
  );
}

export {
  getDistanceMatrix,
};