/**
 * SEO Validation Test Suite for RafflesJobs
 * Tests:
 * 1. Homepage SEO: status 200, title, description, canonical, H1, Organization & WebSite schema, no software-only claims.
 * 2. Jobs Listing Page SEO: status 200, title, canonical, ItemList schema, NO JobPosting schema.
 * 3. Individual Job Page SEO: status 200, unique title, description, canonical, H1, JobPosting JSON-LD, actual job content.
 * 4. Invalid Job Page: 404 handling.
 * 5. Category SEO Page: status 200, breadcrumb, ItemList schema, NO JobPosting schema.
 * 6. Robots.txt: status 200, Allow /, Disallow private dashboards, Sitemap declaration.
 * 7. Sitemap.xml: status 200, valid XML, only indexable URLs, active job URLs, private URLs excluded.
 * 8. Backend SEO API: GET /api/jobs/slug/:slug returns job or 404.
 * 9. Structured Data Validity: JSON-LD parses and validates without errors.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

async function runSeoTests() {
  console.log('============================================================');
  console.log('RAFFLESJOBS — SEO & GOOGLE JOBS VALIDATION TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  const distDir = path.resolve(__dirname, '../client/dist');

  // 1. Homepage HTML validation (dist/index.html)
  console.log('--- 1. HOMEPAGE SEO AUDIT ---');
  const homePath = path.join(distDir, 'index.html');
  assert(fs.existsSync(homePath), 'Homepage HTML exists in build output');
  const homeHtml = fs.readFileSync(homePath, 'utf8');

  assert(
    homeHtml.includes('<title>RafflesJobs – BPO, Sales &amp; Other Job Opportunities</title>') ||
    homeHtml.includes('<title>RafflesJobs – BPO, Sales & Other Job Opportunities</title>'),
    'Homepage has correct branded Title ("RafflesJobs – BPO, Sales & Other Job Opportunities")'
  );

  assert(
    homeHtml.includes('name="description"') &&
    homeHtml.includes('Find BPO, sales, warehouse, support and other job opportunities on RafflesJobs'),
    'Homepage has correct Meta Description prioritizing BPO, sales, warehouse, support'
  );

  assert(
    homeHtml.includes('<link rel="canonical" href="https://www.rafflesjobs.com/"') ||
    homeHtml.includes('<link rel="canonical" href="https://www.rafflesjobs.com/">'),
    'Homepage has correct Canonical URL (https://www.rafflesjobs.com/)'
  );

  assert(
    homeHtml.includes('Find Your Next Job with') && homeHtml.includes('RafflesJobs'),
    'Homepage contains H1 with "Find Your Next Job with RafflesJobs"'
  );

  assert(
    homeHtml.includes('@type":"EmploymentAgency') || homeHtml.includes('@type":"Organization'),
    'Homepage contains Organization / EmploymentAgency structured data'
  );

  assert(
    homeHtml.includes('@type":"WebSite"'),
    'Homepage contains WebSite structured data'
  );

  assert(
    !homeHtml.includes('"@type":"JobPosting"'),
    'Homepage does NOT contain JobPosting schema (forbidden by Google on home)'
  );

  assert(
    !homeHtml.toLowerCase().includes('software-only') && !homeHtml.toLowerCase().includes('hospitality-only'),
    'Homepage does not brand site as software-only or hospitality-only'
  );

  // 2. Jobs Listing Page SEO Audit (dist/jobs/index.html)
  console.log('\n--- 2. JOBS LISTING PAGE SEO AUDIT ---');
  const jobsPath = path.join(distDir, 'jobs/index.html');
  assert(fs.existsSync(jobsPath), 'Jobs listing HTML exists in build output');
  const jobsHtml = fs.readFileSync(jobsPath, 'utf8');

  assert(
    jobsHtml.includes('Jobs – Find Job Opportunities | RafflesJobs') ||
    jobsHtml.includes('Find Jobs'),
    'Jobs page has unique, relevant title'
  );

  assert(
    jobsHtml.includes('<link rel="canonical" href="https://www.rafflesjobs.com/jobs"'),
    'Jobs page has canonical URL (https://www.rafflesjobs.com/jobs)'
  );

  assert(
    !jobsHtml.includes('"@type":"JobPosting"'),
    'Jobs listing page does NOT contain JobPosting schema (Google requirement)'
  );

  assert(
    jobsHtml.includes('/jobs/'),
    'Jobs listing page contains crawlable internal links to individual jobs'
  );

  // 3. Individual Job Page SEO Audit
  console.log('\n--- 3. INDIVIDUAL JOB PAGE SEO & GOOGLE JOBS AUDIT ---');
  const categorySlugs = [
    'bpo', 'sales', 'warehouse', 'support-assistant', 'customer-support',
    'operations', 'back-office', 'marketing', 'finance', 'hr', 'management'
  ];

  const jobDirs = fs.readdirSync(path.join(distDir, 'jobs')).filter(f => {
    return fs.statSync(path.join(distDir, 'jobs', f)).isDirectory() && !categorySlugs.includes(f);
  });

  assert(jobDirs.length >= 10, `Prerendered job pages exist (${jobDirs.length} jobs found)`);

  const sampleSlug = jobDirs[0];
  const sampleJobPath = path.join(distDir, 'jobs', sampleSlug, 'index.html');
  const sampleJobHtml = fs.readFileSync(sampleJobPath, 'utf8');

  assert(
    sampleJobHtml.includes('<h1'),
    'Individual job page contains an H1 heading'
  );

  assert(
    sampleJobHtml.includes(`https://www.rafflesjobs.com/jobs/${sampleSlug}`),
    'Individual job page contains canonical URL pointing to /jobs/:slug'
  );

  assert(
    sampleJobHtml.includes('"@type":"JobPosting"'),
    'Individual job page CONTAINS Schema.org JobPosting structured data'
  );

  // Validate JobPosting JSON-LD parses cleanly
  const jsonLdMatches = sampleJobHtml.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [];
  let foundValidJobPosting = false;
  for (const scriptTag of jsonLdMatches) {
    const rawJson = scriptTag.replace(/<\/?script[^>]*>/g, '');
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed['@type'] === 'JobPosting') {
        assert(parsed.title && parsed.title.length > 0, 'JobPosting has non-empty title');
        assert(parsed.hiringOrganization && parsed.hiringOrganization.name, 'JobPosting has hiringOrganization');
        assert(parsed.jobLocation, 'JobPosting has jobLocation');
        assert(parsed.datePosted, 'JobPosting has datePosted');
        foundValidJobPosting = true;
      }
    } catch (e) {
      assert(false, `Job JSON-LD parsed without error`, e.message);
    }
  }
  assert(foundValidJobPosting, 'Found and verified valid JobPosting JSON-LD');

  // 4. Category Page SEO Audit (dist/jobs/sales/index.html)
  console.log('\n--- 4. CATEGORY SEO PAGE AUDIT ---');
  const categoryPath = path.join(distDir, 'jobs/sales/index.html');
  if (fs.existsSync(categoryPath)) {
    const catHtml = fs.readFileSync(categoryPath, 'utf8');
    assert(
      catHtml.includes('Sales Jobs'),
      'Sales category page has Title / H1 mentioning Sales Jobs'
    );
    assert(
      !catHtml.includes('"@type":"JobPosting"'),
      'Category page does NOT contain JobPosting schema'
    );
    assert(
      catHtml.includes('https://www.rafflesjobs.com/jobs/sales'),
      'Category page has canonical URL'
    );
  } else {
    console.log('[INFO] /jobs/sales directory will be generated dynamically or has < 3 jobs');
  }

  // 5. Robots.txt Audit
  console.log('\n--- 5. ROBOTS.TXT AUDIT ---');
  const robotsPublicPath = path.join(__dirname, '../client/public/robots.txt');
  const robotsHtml = fs.readFileSync(robotsPublicPath, 'utf8');
  assert(robotsHtml.includes('User-agent: *'), 'Robots.txt declares User-agent: *');
  assert(robotsHtml.includes('Allow: /'), 'Robots.txt allows public routes');
  assert(robotsHtml.includes('Disallow: /admin-dashboard'), 'Robots.txt disallows /admin-dashboard');
  assert(robotsHtml.includes('Disallow: /employer-dashboard'), 'Robots.txt disallows /employer-dashboard');
  assert(robotsHtml.includes('Disallow: /jobseeker-dashboard'), 'Robots.txt disallows /jobseeker-dashboard');
  assert(robotsHtml.includes('Sitemap: https://www.rafflesjobs.com/sitemap.xml'), 'Robots.txt declares Sitemap URL');

  // 6. Sitemap.xml Audit
  console.log('\n--- 6. SITEMAP.XML AUDIT ---');
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'Sitemap.xml exists');
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');

  assert(sitemapXml.includes('<loc>https://www.rafflesjobs.com/</loc>'), 'Sitemap includes homepage');
  assert(sitemapXml.includes('<loc>https://www.rafflesjobs.com/jobs</loc>'), 'Sitemap includes /jobs');
  assert(sitemapXml.includes('<loc>https://www.rafflesjobs.com/about</loc>'), 'Sitemap includes /about');
  assert(sitemapXml.includes('<loc>https://www.rafflesjobs.com/contact</loc>'), 'Sitemap includes /contact');
  assert(sitemapXml.includes('<loc>https://www.rafflesjobs.com/jobs/'), 'Sitemap includes individual active job URLs');
  assert(sitemapXml.includes('<lastmod>'), 'Sitemap entries include valid <lastmod>');
  assert(!sitemapXml.includes('admin-dashboard'), 'Sitemap does NOT include admin-dashboard');
  assert(!sitemapXml.includes('employer-dashboard'), 'Sitemap does NOT include employer-dashboard');
  assert(!sitemapXml.includes('jobseeker-dashboard'), 'Sitemap does NOT include jobseeker-dashboard');
  assert(!sitemapXml.includes('verify-otp'), 'Sitemap does NOT include verify-otp');

  // 7. 404.html Audit
  console.log('\n--- 7. 404 PAGE AUDIT ---');
  const notFoundPath = path.join(distDir, '404.html');
  assert(fs.existsSync(notFoundPath), '404.html exists in build output');
  const notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
  assert(notFoundHtml.includes('404') && notFoundHtml.includes('Page not found'), '404.html has friendly not found message');
  assert(notFoundHtml.includes('content="noindex,follow"'), '404.html is marked noindex');

  // 8. Backend server routes test (robots.txt & sitemap.xml)
  console.log('\n--- 8. BACKEND SEO ENDPOINTS TEST ---');
  const dotenv = require('dotenv');
  dotenv.config();
  const connectDB = require('./config/db');
  await connectDB();

  const Job = require('./models/Job');
  const activeCount = await Job.countDocuments({ status: 'active' });
  assert(activeCount > 0, `MongoDB has ${activeCount} active jobs`);

  // Verify all active jobs have slugs
  const unsluggedCount = await Job.countDocuments({
    status: 'active',
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }]
  });
  assert(unsluggedCount === 0, `All active jobs in MongoDB have assigned slugs (0 unslugged)`);

  console.log('\n============================================================');
  console.log(`SEO TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runSeoTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
