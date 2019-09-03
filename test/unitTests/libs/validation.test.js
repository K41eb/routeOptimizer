import { expect } from 'chai';
import moment from 'moment';

import { validateRequest, validateResponse } from '../../../src/libs/validation.js';
import { ValidationError, InternalServerError } from '../../../src/libs/errors.js';

import sampleRequest from '../samples/serverSamples/sample-request.json';
import sampleResponse from '../samples/serverSamples/schedule-response.json';

describe('validateRequest', function () {
  let customRequest;
  beforeEach(() => {
    customRequest = JSON.parse(JSON.stringify(sampleRequest));
  });

  context('when called with valid data', () => {
    it('accepts requests with proper departureTime and fields', () => {
      customRequest.departureTime = `${moment().add(2, 'd').unix()}`;

      let error = null;
      try {
        validateRequest(customRequest);
      }
      catch (e) {
        error = e;
      }

      expect(error).to.be.equal(null);
    });
  });

  context('when called with invalid data', () => {
    context('when called with invalid departureTime data', () => {
      it('rejects requests with a departureTime in the past', () => {
        customRequest.departureTime = `${moment().subtract(2, 'd').unix()}`;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Property 'departureTime' is in the past, I can't schedule your past.");
      });
    });

    context('when called with missing fields', () => {
      beforeEach(() => {
        customRequest.departureTime = moment().add(2, 'd').unix();
      });

      it("rejects requests without the 'home' property", () => {
        delete customRequest.home;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });

      it("rejects requests without the 'departureTime' property", () => {
        delete customRequest.departureTime;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
      
      it("rejects requests without the 'tasks' property", () => {
        delete customRequest.tasks;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
      
      it("rejects requests where locations miss a 'lat' coordiante property", () => {
        delete customRequest.home.lat;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
      
      it("rejects requests where locations miss a 'lng' coordiante property", () => {
        delete customRequest.home.lng;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
      
      it("rejects requests where tasks miss an 'id' property", () => {
        delete customRequest.tasks[0].id;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
      
      it("rejects requests where tasks miss a 'duration' property", () => {
        delete customRequest.tasks[0].duration;

        let error = null;
        try {
          validateRequest(customRequest);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(ValidationError);
        expect(error).to.have.property('message').that.is.equal("Schema validation failed, please check your request.");
      });
    });
  });
});

describe('validateResponse', function () {
  let customResponse;
  beforeEach(() => {
    customResponse = JSON.parse(JSON.stringify(sampleResponse));
  });

  context('when called with valid data', () => {
    it('accepts schedules with proper fields', () => {

      let error = null;
      try {
        validateResponse(customResponse);
      }
      catch (e) {
        error = e;
      }

      expect(error).to.be.equal(null);
    });
  });

  context('when called with invalid data', () => {
    context('when called with missing fields', () => {
      it("rejects schedules without the 'totalTime' property", () => {
        delete customResponse.totalTime;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });

      it("rejects schedules without the 'schedule' property", () => {
        delete customResponse.schedule;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
      
      it("rejects schedules with locations missing the 'lat' property", () => {
        delete customResponse.schedule[0].lat;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
      
      it("rejects schedules with locations missing the 'lng' property", () => {
        delete customResponse.schedule[0].lng;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
      
      it("rejects schedules with tasks missing the 'id' property", () => {
        delete customResponse.schedule[0].id;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
      
      it("rejects schedules with tasks missing the 'startsAt' property", () => {
        delete customResponse.schedule[0].startsAt;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
      
      it("rejects schedules with tasks missing the 'endsAt' property", () => {
        delete customResponse.schedule[0].endsAt;

        let error = null;
        try {
          validateResponse(customResponse);
        }
        catch (e) {
          error = e;
        }

        expect(error).not.to.be.equal(null);
        expect(error).to.be.instanceOf(InternalServerError);
        expect(error).to.have.property('message').that.is.equal("The server produced malformed data, aborting.");
      });
    });
  });
});