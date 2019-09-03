import Ajv from 'ajv';
import moment from 'moment';

import { InternalServerError, ValidationError } from './errors.js';
import requestSchema from '../../resources/schemas/route-optimizer-request.schema.json';
import responseSchema from '../../resources/schemas/route-optimizer-response.schema.json';



/**
 * To checkDateOfDeparture makes sure that the provided departureTime is in the future.
 * 
 * @param  {number} departureTime - UNIX timestamp.
 *
 * @throws {ValidationError} - If the provided date is in the past.
 * 
 * @return {void} - No return statement.
 */
function checkDateOfDeparture(departureTime) {
  const now = moment();
  const dateOfDeparture = moment.unix(departureTime);

  if (dateOfDeparture.isBefore(now)) {
    throw new ValidationError({
      message: "Property 'departureTime' is in the past, I can't schedule your past.",
    });
  }
}

/**
 * To validateJsonAgainstSchemas we use Ajv to check that the provided JSON object matches with all
 * provided schemas.
 * 
 * @param  {object}   json    - JSON data to be validated.
 * @param  {object[]} schemas - The schemas to validate against.
 * 
 * @return {object} - Response with potential errors.
 */
function validateJsonAgainstSchema(json, schema) {
  const options = {
    allErrors: true,
  };

  const ajv = new Ajv(options);
  const valid = ajv.validate(schema, json);

  return {
    valid,
    errors: ajv.errors,
  };
}

/**
 * validateRequestAgainstSchemas makes sure that the request has all the required fields according
 * to the JSON schema definition(s).
 * 
 * @param {object} body - The raw body received by the server.
 * 
 * @throws {ValidationError} - If the request didn't pass the schema check.
 * 
 * @return {void} - No return statement.
 */
function validateRequestAgainstSchemas(body) {
  const {
    valid,
    errors,
  } = validateJsonAgainstSchema(body, requestSchema);

  if (!valid) {
    throw new ValidationError({
      message: 'Schema validation failed, please check your request.',
      detail: errors,
    });
  }
}

/**
 * validateRequest makes all the necessary checks to make sure the request is valid and can be
 * processed.
 * 
 * @param {object} body - The raw body received by the server.
 *
 * @throws {ValidationError} - If the request can't be processed.
 * 
 * @return {void} - No return statement.
 */
function validateRequest(body) {
  validateRequestAgainstSchemas(body);
  checkDateOfDeparture(body.departureTime);
}

/**
 * To validateResponseAgainstSchemas we check that the schedule produced by the server matched the
 * schemas definitions.
 * 
 * @param {object} schedule - The raw response produced by the server.
 *
 * @throws {InternalServerError} - If the response is invalid.
 * 
 * @return {void} - No return statement.
 */
function validateResponseAgainstSchemas(schedule) {
  const {
    valid,
    errors,
  } = validateJsonAgainstSchema(schedule, responseSchema);

  if (!valid) {
    throw new InternalServerError({
      message: 'The server produced malformed data, aborting.',
      detail: errors,
    });
  }
}

/**
 * To validateResponse we validate the schedule against the server's response schema.
 * 
 * @param {object} schedule - The raw response produced by the server.
 *
 * @throws {InternalServerError} - If the response is invalid.
 * 
 * @return {void} - No return statement.
 */
function validateResponse(schedule) {
  validateResponseAgainstSchemas(schedule);
}

export {
  validateRequest,
  validateResponse,
};