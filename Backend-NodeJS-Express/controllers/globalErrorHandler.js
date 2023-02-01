const sendErrorDev = (err, res) => {
  // When an error occurs in development mode, we are sending JSON object with four properties (status, error, message, stack)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // err.isOperational is a property that we have added to the error object in the AppError class.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //Programming or other unknown error: dont leak error details
  else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  // if err.StatusCode is undefined then set it to 500
  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err, {});
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
