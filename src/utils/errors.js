// src/utils/errors.js
class AppError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  class AuthenticationError extends AppError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  class AuthorizationError extends AppError {
    constructor(message) {
      super(message, 403);
    }
  }
  
  module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError
  };