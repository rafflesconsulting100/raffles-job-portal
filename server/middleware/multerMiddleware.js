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
    cb(new Error('Unsupported file type. Please upload a JPEG, PNG, WEBP image or PDF, DOC, DOCX document.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Matches the 10MB limit the client advertises (see OtpPage.jsx).
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
