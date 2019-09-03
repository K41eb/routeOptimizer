import { expect } from  'chai';

import { getOptimizedRoute, $imports } from '../../src/getOptimizedRoute.js';

describe('getOptimizedRoute', () => { // TODO
  afterEach(() => {
    $imports.$restore();
  });

  it('only orchestrates subtasks', async () => {
    // Mock all imports to do nothing. By doing this we are making sure that getOptimizedRoute only
    // forwards one function's result to another, and thus performs 0 logic by itself.
    $imports.$mock({
      './libs/validation.js': {
        validateRequest: () => {},
        validateResponse: () => {},
      },
      './libs/getDataFromGoogle.js': {
        getDataFromGoogle: () => Promise.resolve(),
      },
      './libs/getDistanceMatrix.js': {
        getDistanceMatrix: () => {},
      },
      './libs/solveTsp.js': {
        solveTsp: () => Promise.resolve(),
      },
      './libs/getSchedule.js': {
        getSchedule: () => {},
      },
    });

    let error = null;
    let result = null;
    try {
      result = await getOptimizedRoute();
    }
    catch (e) {
      error = e;
    }

    expect(error).to.be.equal(null);
    expect(typeof result).to.be.equal('undefined');
  });
});