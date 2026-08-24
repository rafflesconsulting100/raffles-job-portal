const cloudinary = require('cloudinary').v2;
const path = require('path');

// Validate Cloudinary credentials on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    'Cloudinary credentials are missing! Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Core Cloudinary upload helper — always uploads directly to cloud.
 * @param {Object} file         - Multer memory file object (file.buffer, file.originalname, file.mimetype)
 * @param {string} subfolder    - Target subfolder under 'job_portal' (e.g. 'avatars', 'resumes')
 * @param {Object} extraOptions - Additional Cloudinary upload options (overrides defaults)
 * @returns {Promise<string>}   - Secure public Cloudinary URL
 */
const uploadToCloud = async (file, subfolder = 'general', extraOptions = {}) => {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided for upload.');
  }

  const isDocument =
    file.mimetype.includes('pdf') ||
    file.mimetype.includes('msword') ||
    file.mimetype.includes('officedocument');

  const resourceType = extraOptions.resource_type || (isDocument ? 'raw' : 'auto');

  // Sanitize filename (remove spaces & special chars)
  const sanitizedBase = path.parse(file.originalname)
    .name
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  const ext = path.extname(file.originalname);

  // For raw documents, include file extension in public_id so Cloudinary preserves MIME on download
  const publicId = resourceType === 'raw'
    ? `${sanitizedBase}_${Date.now()}${ext}`
    : `${sanitizedBase}_${Date.now()}`;

  const uploadOptions = {
    folder: `job_portal/${subfolder}`,
    resource_type: resourceType,
    public_id: publicId,
    overwrite: false,
    ...extraOptions,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error(`[Cloudinary] Upload failed (job_portal/${subfolder}):`, error.message);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
      //  console.log(`[Cloudinary] Uploaded: ${result.secure_url}`);
        resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

/**
 * Upload profile photo / avatar — routes to job_portal/avatars
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Secure Cloudinary URL
 */
const uploadAvatar = (file) =>
  uploadToCloud(file, 'avatars', {
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

/**
 * Upload resume / CV document — routes to job_portal/resumes
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Secure Cloudinary URL
 */
const uploadResume = (file) =>
  uploadToCloud(file, 'resumes', {
    resource_type: 'auto',
  });

module.exports = {
  uploadToCloud,
  uploadAvatar,
  uploadResume,
};
