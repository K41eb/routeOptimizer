import { expect } from 'chai';

import { getDataFromGoogle, $imports } from '../../../src/libs/getDataFromGoogle.js';

import sampleRequest from '../samples/serverSamples/sample-request.json';
import sampleGoogleResponse from '../samples/googleApiSamples/sample-google-response.json';


/**
 * To mockGoogleApiWithPromise we replace the 'src/libs/getDataFromGoogle.js' file's @google/maps
 * import with a stub that, in the end, returns the provided promise.
 * 
 * @param  {[type]} promise - A promise that resolves data or rejects with an error.
 * 
 * @return {void} - No return statement.
 */
function mockGoogleApiWithPromise(promise) {
  async function asPromise() {
    return promise;
  }

  function distanceMatrix () {
    return {
      asPromise,
    };
  }

  function createClient () {
    return {
      distanceMatrix,
    };
  }

  $imports.$mock({
    '@google/maps': {
      createClient,
    },
  });
}

describe('getDataFromGoogle', () => {
  let customRequest;
  beforeEach(() => {
    customRequest = JSON.parse(JSON.stringify(sampleRequest));
  });

  afterEach(() => {
    $imports.$restore();
  });

  context('when google maps returns a success', () => {
    it("returns google maps' api raw response", async () => {
      mockGoogleApiWithPromise(Promise.resolve(sampleGoogleResponse));

      let result = null;
      let error = null;
      try {
        result = await getDataFromGoogle(customRequest);
      }
      catch (e) {
        error = e;
      }

      expect(error).to.be.equal(null);

      expect(result).to.be.deep.equal(sampleGoogleResponse);
    });
  });

  context('when the google maps npm package rejects with an error', () => {
    it("returns a 500 GoogleApiError", async () => {
      let errorMessage = "Promise rejected!";
      mockGoogleApiWithPromise(
        Promise.reject(new Error(errorMessage))
      );

      let result = null;
      let error = null;
      try {
        result = await getDataFromGoogle(customRequest);
      }
      catch (e) {
        error = e;
      }

      expect(error).not.to.be.equal(null);
      expect(error.status).to.be.equal(500);
      expect(error.type).to.be.equal('GoogleApiError');
      expect(error.message).to.be.equal(errorMessage);

      expect(result).to.be.equal(null);
    });
  });
});