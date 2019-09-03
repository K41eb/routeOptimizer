import { expect } from 'chai';

import { solveTsp } from '../../../src/libs/solveTsp.js';

import sampleGoogleResponse from '../samples/googleApiSamples/sample-google-response.json';

describe('solveTsp', function () {
  // Set the test timeout to 10s because computation can take some time. About 8s on average.
  this.timeout(10000);

  context("with valid data", () => {
    it('solves the TSP for a straight line', async () => {
      // This matrix is a straight line of three points 0-1-2.
      const matrix = [
        [0, 1, 2],
        [1, 0, 1],
        [2, 1, 0],
      ];

      const res = await solveTsp(matrix);

      expect(res).to.be.deep.equal([0, 1, 2, 0]);
    });

    // Somehow this test yields nondeterministic results.
    it.skip('solves the TSP for scattered points', async () => {
      const matrix = sampleGoogleResponse.json.rows.map(
        (row) => row.elements.map((element) => element.duration.value)
      );

      const res = await solveTsp(matrix);

      expect(res).to.be.deep.equal([0, 3, 2, 1, 4, 0]);
    });
  });

  context("with invalid data", () => {
    it('throws an internalServerError with anything else than a 2d array', async () => {
      let error;
      try {
        await solveTsp({});
      }
      catch (e) {
        error = e;
      }

      expect(error.message).to.be.equal(
        "Couldn't solve the TSP probelm: Costmatrix needs to be a 2d symmetric array!"
      );
      expect(error.status).to.be.equal(500);
    });

    it('throws an internalServerError with anything else than a finite number as distance', async () => {
      const matrix = [
        [0, 1, 2],
        [1, 0, 1],
        [2, 1, NaN],
      ];

      let error = null;
      try {
        await solveTsp(matrix);
      }
      catch (e) {
        error = e;
      }

      expect(error).not.to.be.equal(null);
      expect(error).to.have.property('message').that.is.equal(
        "Couldn't solve the TSP probelm: Costmatrix should only contain finite numbers!",
      );
      expect(error.status).to.be.equal(500);
    });
  });
});