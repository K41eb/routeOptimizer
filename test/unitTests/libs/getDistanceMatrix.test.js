import { expect } from  'chai';

import { getDistanceMatrix } from '../../../src/libs/getDistanceMatrix.js';

import sampleGoogleResponse from '../samples/googleApiSamples/sample-google-response.json';


describe('getDistanceMatrix', () => {
  it("produces a valid distance matrix from google's response", async () => {

    let error = null;
    let result = null;
    try {
      result = await getDistanceMatrix(sampleGoogleResponse);
    }
    catch (e) {
      error = e;
    }

    expect(error).to.be.equal(null);
    expect(result).to.be.deep.equal([
      [ 0, 1111, 1472, 1405, 639 ],
      [ 975, 0, 1520, 2097, 899 ],
      [ 1594, 1442, 0, 1978, 1791 ],
      [ 1590, 2269, 1906, 0, 1661 ],
      [ 830, 1077, 1684, 1650, 0 ]
    ]);
  });
});