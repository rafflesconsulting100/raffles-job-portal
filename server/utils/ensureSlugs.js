// Backfills a URL slug for jobs created before slugs existed.
// Runs once at server startup so /jobs/<slug> links, the sitemap and the
// build-time prerender all resolve against the same stored values.

const Job = require('../models/Job');
const { buildJobSlug, isReservedSlug } = require('./slug');

async function ensureJobSlugs() {
  const missing = await Job.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  })
    .select('_id title location slug')
    .lean();

  if (missing.length === 0) return 0;

  let updated = 0;
  for (const job of missing) {
    const base = buildJobSlug(job);
    const suffix = job._id.toString().slice(-6);
    let candidate = base;

    if (isReservedSlug(candidate)) {
      candidate = `${base}-${suffix}`;
    }

    const taken = await Job.findOne({ slug: candidate, _id: { $ne: job._id } })
      .select('_id')
      .lean();
    if (taken) {
      candidate = `${candidate}-${suffix}`;
    }

    await Job.updateOne({ _id: job._id }, { $set: { slug: candidate } });
    updated += 1;
  }

  if (updated > 0) {
    console.log(`Slug backfill: assigned slugs to ${updated} job(s)`);
  }
  return updated;
}

module.exports = { ensureJobSlugs };
