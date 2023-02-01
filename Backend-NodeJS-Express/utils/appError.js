class AppError extends Error {
    constructor(message, statusCode) {
      // The message argument is passed to the parent class constructor using super(message).
      super(message);
      // In addition to the Error class, we are adding three more properties to the error object.
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }

// (err, req, res, next) => {... }. The above code adds four properties to the error object. That's it.
  
export default AppError;
