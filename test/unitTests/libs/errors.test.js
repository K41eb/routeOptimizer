import { expect } from 'chai';

import * as errors from '../../../src/libs/errors.js';

describe('Errors', () => {
  it('successfully creates a 500 InternalServerError error', async () => {
    const errorMessage = 'test';
    const errorDetail = {
      test: 'test',
    };

    const error = new errors.InternalServerError({
      message: errorMessage,
      detail: errorDetail,
    });

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message').that.is.equal(errorMessage);
    expect(error).to.have.property('detail').that.is.deep.equal(errorDetail);
    expect(error).to.have.property('status').that.is.equal(500);
    expect(error).to.have.property('type').that.is.equal('InternalServerError');
    expect(error).to.have.property('defaultMessage').that.is.equal(
      'Internal server error.',
    );
  });

  it('successfully creates a 500 GoogleApiError error', async () => {
    const errorMessage = 'test';
    const errorDetail = {
      test: 'test',
    };

    const error = new errors.GoogleApiError({
      message: errorMessage,
      detail: errorDetail,
    });

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message').that.is.equal(errorMessage);
    expect(error).to.have.property('detail').that.is.deep.equal(errorDetail);
    expect(error).to.have.property('status').that.is.equal(500);
    expect(error).to.have.property('type').that.is.equal('GoogleApiError');
    expect(error).to.have.property('defaultMessage').that.is.equal(
      'An error occured with the google maps API.',
    );
  });

  it('successfully creates a 402 AuthenticationError error', async () => {
    const errorMessage = 'test';
    const errorDetail = {
      test: 'test',
    };

    const error = new errors.AuthenticationError({
      message: errorMessage,
      detail: errorDetail,
    });

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message').that.is.equal(errorMessage);
    expect(error).to.have.property('detail').that.is.deep.equal(errorDetail);
    expect(error).to.have.property('status').that.is.equal(402);
    expect(error).to.have.property('type').that.is.equal('AuthenticationError');
    expect(error).to.have.property('defaultMessage').that.is.equal(
      'Authentication failed.',
    );
  });

  it('successfully creates a 400 ValidationError error', async () => {
    const errorMessage = 'test';
    const errorDetail = {
      test: 'test',
    };

    const error = new errors.ValidationError({
      message: errorMessage,
      detail: errorDetail,
    });

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message').that.is.equal(errorMessage);
    expect(error).to.have.property('detail').that.is.deep.equal(errorDetail);
    expect(error).to.have.property('status').that.is.equal(400);
    expect(error).to.have.property('type').that.is.equal('ValidationError');
    expect(error).to.have.property('defaultMessage').that.is.equal(
      'Invalid input.',
    );
  });

  it('successfully creates a Custom error', async () => {
    const errorMessage = 'test';
    const errorDetail = {
      test: 'test',
    };

    const error = new errors.CustomError({
      message: errorMessage,
      detail: errorDetail,
    });

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('message').that.is.equal(errorMessage);
    expect(error).to.have.property('detail').that.is.deep.equal(errorDetail);
    expect(error).to.have.property('status').that.is.equal(500);
    expect(error).to.have.property('type').that.is.equal('Error');
    expect(error).to.have.property('defaultMessage').that.is.equal(
      'Error.',
    );
  });
});