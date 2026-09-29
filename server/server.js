const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { initSocket } = require('./utils/socket');
const { ensureJobSlugs } = require('./utils/ensureSlugs');
const { ensureEmployerFields } = require('./utils/ensureEmployerFields');
const { ensureUserRecords } = require('./utils/ensureUserRecords');

// Load environment variables
dotenv.config();

// Fail fast when production secrets are missing or unsafe
try {
  require('./config/auth').validateServerSecrets();
} catch (err) {
  console.error(`Startup aborted: ${err.message}`);
  process.exit(1);
}

const app = express();

// Reverse proxy handling (needed so rate limiting keys on the real client IP).
// Set TRUST_PROXY=true, a hop count like 1, or an Express trust list such as
// 'loopback' when running behind nginx / a load balancer. Leave unset when the
// API is exposed directly.
const trustProxy = (process.env.TRUST_PROXY || '').trim();
if (trustProxy === 'true') {
  app.set('trust proxy', true);
} else if (trustProxy && trustProxy !== 'false') {
  app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
}

// Middlewares
// CORS configuration
const defaultOrigins = process.env.NODE_ENV === 'production'
  ? ['https://www.rafflesjobs.com', 'https://rafflesjobs.com']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests with no origin header (like server-side curl, mobile apps, or prerender)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error('Not allowed by CORS');
      err.statusCode = 403;
      callback(err);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// All media files (avatars, resumes) are stored directly on Cloudinary — no local file serving needed

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Public SEO endpoints
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin-dashboard\nDisallow: /employer-dashboard\nDisallow: /jobseeker-dashboard\nDisallow: /job-seeker-dashboard\nDisallow: /verify-otp\n\nSitemap: https://www.rafflesjobs.com/sitemap.xml\n`);
});

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const Job = require('./models/Job');
    const { notExpiredCondition } = require('./utils/jobExpiry');
    const jobs = await Job.find({ status: 'active', ...notExpiredCondition() })
      .select('slug updatedAt createdAt')
      .lean();

    const staticRoutes = [
      'https://www.rafflesjobs.com/',
      'https://www.rafflesjobs.com/jobs',
      'https://www.rafflesjobs.com/about',
      'https://www.rafflesjobs.com/contact',
      'https://www.rafflesjobs.com/pricing',
      'https://www.rafflesjobs.com/privacy',
    ];

    const xmlUrls = staticRoutes.map(
      (loc) => `<url><loc>${loc}</loc></url>`
    );

    for (const job of jobs) {
      if (!job.slug) continue;
      const lastmodDate = job.updatedAt || job.createdAt;
      const lastmod = lastmodDate ? new Date(lastmodDate).toISOString() : null;
      xmlUrls.push(
        `<url><loc>https://www.rafflesjobs.com/jobs/${job.slug}</loc>${
          lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
        }</url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${xmlUrls.join('\n  ')}\n</urlset>\n`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Root route for API verification
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Raffles Job Portal ' });
});

// Unknown API paths fell through to Express' default final handler, which
// answers `Cannot GET ...` as text/html — so every client that reads
// `error.response.data.message` showed a meaningless "connection error".
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware (Must be last)
app.use(errorHandler);

// Connect to MongoDB Database, then make sure every job has a public URL slug
// (required for /jobs/<slug> SEO pages and the sitemap).
// Server only starts listening AFTER DB connection is established.
connectDB()
  .then(async (conn) => {
    await ensureJobSlugs();
    await ensureEmployerFields();
    await ensureUserRecords();

    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || 'development';

    if (!process.env.NODE_ENV) {
      console.warn('[startup] NODE_ENV is not set — treating this instance as development. Set NODE_ENV=production when deploying.');
    }

    // Create HTTP server and attach Socket.IO
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections / uncaught exceptions.
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err && err.message ? err.message : err}`);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception: ${err && err.message ? err.message : err}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
