import { expect } from 'chai';

import { getSchedule } from '../../../src/libs/getSchedule.js';

import sampleRequest from '../samples/serverSamples/sample-request.json';
import expectedSchedule from '../samples/serverSamples/schedule-response.json';

import sampleGoogleResponse from '../samples/googleApiSamples/sample-google-response.json';

describe('getSchedule', () => {
  it('successfully creates a schedule', async () => {
    const distancesMatrix = sampleGoogleResponse.json.rows.map(
      (row) => row.elements.map((element) => element.duration.value)
    );
    const optimalPath = [0, 3, 2, 1, 4, 0];

    let result = null;
    let error = null;
    try {
      result = getSchedule(sampleRequest, distancesMatrix, optimalPath);
    }
    catch (e) {
      error = e;
    }

    expect(error).to.be.equal(null);

    expect(result).to.be.deep.equal(expectedSchedule);
  });
});
