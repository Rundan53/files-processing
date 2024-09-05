class AppError extends Error {
  constructor(message, httpStatusCode, details = {}) {
    super(message);
    this.statusCode = httpStatusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.success = false;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
