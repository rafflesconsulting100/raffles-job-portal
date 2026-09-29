const multer = require('multer');

// Store files in memory so we can upload them as buffers
const storage = multer.memoryStorage();

// File check
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // multer forwards fileFilter errors unwrapped (err.name === 'Error'), so
    // without statusCode the error middleware answered 500 for a client-side
    // problem. Mark it as a 400.
    const err = new Error('Unsupported file type. Please upload a JPEG, PNG, WEBP image or PDF, DOC, DOCX document.');
    err.statusCode = 400;
    cb(err, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Matches the 10MB limit the client advertises (see OtpPage.jsx).
    fileSize: 10 * 1024 * 1024,
    // Resume + avatar at most — anything more is an abuse attempt.
    files: 2,
  },
});

module.exports = upload;
