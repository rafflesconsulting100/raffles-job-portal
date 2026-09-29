const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600) {
    statusCode = err.statusCode;
  }
  let message = err.message;

  // Handle Multer upload errors (file too large / unexpected field ...)
  if (err.name === 'MulterError') {
    statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File is too large. Please upload a smaller file.'
      : `Upload error: ${err.message}`;
  }

  // Handle Mongoose Cast Errors.
  // ObjectId -> 404 (bad id); Date/Number casts (e.g. expiresAt: "abc") are
  // client input errors -> 400, not a server crash.
  if (err.name === 'CastError') {
    statusCode = err.kind === 'ObjectId' ? 404 : 400;
    message = err.kind === 'ObjectId'
      ? 'Resource not found with that identifier'
      : `Invalid value for "${err.path}": ${err.value}`;
  }

  // Handle Duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'An record with that detail already exists (e.g. email or application duplicate)';
  }

  // Handle Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Log a sanitized one-liner only. body-parser attaches the raw request
  // payload to JSON parse errors (`err.body`), and printing the whole error
  // object dumped submitted passwords/OTPs into the logs.
  console.error(
    `[error] ${statusCode} ${req.method} ${req.originalUrl} - ${err.name}: ${err.message}`
  );
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
