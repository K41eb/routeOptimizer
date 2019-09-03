class CustomError extends Error {
  constructor({ message, detail }) {
    super(message);

    this.detail = detail;
    
    this.type = 'Error';
    this.defaultMessage = 'Error.';
    this.status = 500;
  }
}

class ValidationError extends CustomError {
  constructor({ message, detail }) {
    super({
      message,
      detail,
    });

    this.type = 'ValidationError';
    this.defaultMessage = 'Invalid input.'
    this.status = 400;
  }
}

class AuthenticationError extends CustomError {
  constructor({ message, detail }) {
    super({
      message,
      detail,
    });

    this.type = 'AuthenticationError';
    this.defaultMessage = 'Authentication failed.'
    this.status = 402;
  }
}

class InternalServerError extends CustomError {
  constructor({ message, detail }) {
    super({
      message,
      detail,
    });

    this.type = 'InternalServerError';
    this.defaultMessage = 'Internal server error.'
    this.status = 500;
  }
}

class GoogleApiError extends CustomError {
  constructor({ message, detail }) {
    super({
      message,
      detail,
    });

    this.type = 'GoogleApiError';
    this.defaultMessage = 'An error occured with the google maps API.'
    this.status = 500;
  }
}

export {
  AuthenticationError,
  CustomError,
  GoogleApiError,
  InternalServerError,
  ValidationError,
}